import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { CircularProgress, MenuItem, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

import { fetchInstance } from '@/utils/fetchInstance';
import { ProjectRequirement } from '@/store/actions/projects/ProjectRequirement';

import styles from './styles.module.css';

const ModalImport = (props) => {
  const { isOpen, onRequestClose, selectedWorkItemIds } = props;

  const dispatch = useDispatch();

  const projectList = useSelector((state) => state?.requirements?.data);
  const loginData = useSelector((state) => state.login);

  const [requirementList, setRequirementList] = useState([]);
  const [project, setProject] = useState('');
  const [requirement, setRequirement] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const req = projectList?.find(
      (item) => item?.projectName === project,
    )?.requirements;
    setRequirementList(req || []);
  }, [project, projectList]);

  const handleChangeProject = (event) => {
    setProject(event?.target?.value);
    setRequirement('');
  };

  const handleChangeRequirement = (event) => {
    setRequirement(event?.target?.value);
  };

  const handleSave = () => {
    setLoading(true);

    fetchInstance('api/saveAzureDevOps', {
      method: 'POST',
      variables: {
        data: {
          orgID: loginData.authKeys.orgID,
          userID: loginData.authKeys.userid,
          projectName: project,
          requirementName: requirement,
          selectedWorkItemIds: selectedWorkItemIds,
        },
      },
    })
      .then((res) => {
        if (res?.statusCode === 202 || res?.statusCode === 200) {
          onRequestClose();
          toast.success(`Save successfully!`);
          dispatch(
            ProjectRequirement({
              userID: loginData.authKeys.userid,
              orgID: loginData.authKeys.orgID,
            }),
          );
          return;
        }
        toast.error(`Failed to save!`);
      })
      .catch((error) => {
        return error;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles?.modalWrap}
      ariaHideApp={false}
    >
      <div className={styles.header}>
        Azure DevOps Import
        <CloseIcon onClick={onRequestClose} className="cursor-pointer" />
      </div>
      <div className={styles.contentWrap}>
        <p className={styles.title}>Project:</p>
        <Select
          id="project"
          displayEmpty
          className={styles.selectWrap}
          value={project}
          onChange={handleChangeProject}
          renderValue={(selected) => {
            if (!selected) {
              return <div>Select project...</div>;
            }
            return selected;
          }}
        >
          {projectList?.length ? (
            (projectList || [])?.map((item) => (
              <MenuItem
                className={styles.menuItem}
                key={item?.projectID}
                value={item?.projectName}
              >
                {item?.projectName}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled value="">
              No data...
            </MenuItem>
          )}
        </Select>

        <p className={styles.title}>Requirement:</p>
        <Select
          id="requirement"
          className={styles.selectWrap}
          value={requirement}
          displayEmpty
          disabled={!project}
          onChange={handleChangeRequirement}
          renderValue={(selected) => {
            if (!selected) {
              return <div>Select requirement...</div>;
            }
            return selected;
          }}
        >
          {requirementList?.length ? (
            requirementList?.map((item) => (
              <MenuItem
                className={styles.menuItem}
                key={item?.requirementID}
                value={item?.requirementName}
              >
                {item?.requirementName}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled value="">
              No data...
            </MenuItem>
          )}
        </Select>
        <div className={styles.buttonWrap}>
          <button
            className={
              project && requirement
                ? 'button-secondary-common'
                : 'disabled-button-common'
            }
            disabled={!project || !requirement || loading}
            onClick={handleSave}
          >
            {loading ? (
              <CircularProgress
                sx={{
                  color: '#ffffff',
                }}
              />
            ) : (
              <>
                <SaveIcon />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalImport;
