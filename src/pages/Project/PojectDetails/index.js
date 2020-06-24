import React, { useState, useRef, useEffect, useCallback } from 'react';
import { genericRequest, genericPutRequest } from '../../../api/actions';
import TextField from '@material-ui/core/TextField';
import { Dropdown, Button } from 'semantic-ui-react';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Box,
  IconButton,
  Modal,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MaterialTable from 'material-table';
import { Edit, AddBox } from '@material-ui/icons';

import { tableIcons } from '../../../components/Icons';
import StateModal from '../../../components/modal/StateModal';
import { transformDataToSelector } from '../../../helpers';
import { useStyles } from '../../../helpers/styles';
import IssueTable from '../../../components/material-table/IssueTable';
import { toast } from 'react-toastify';
import { HashLink } from '../../../components/toast';

const ProjectDetail = (props) => {
  const classes = useStyles();

  const [labelsTable, setLabelsTable] = useState({
    columns: [{ title: 'Name', field: 'name' }],
    data: [],
  });

  const [stateTable, setStateTable] = useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Initial State', field: 'initialState', type: 'boolean' },
      {
        title: 'Transitions to',
        field: 'transitionsTo',
        type: 'string',
        render: (rowData) => (
          <>
            <Dropdown
              fluid
              multiple
              selection
              options={rowData.transitionsTo}
            />
          </>
        ),
      },
    ],

    data: [],
  });

  const [project, setProject] = useState(null);
  const projectEntities = useRef({});
  const editProject = useRef({});
  const [isEditable, setReadOnly] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const [open, setOpen] = useState(false);

  const getIssues = useCallback(async (project) => {
    const uri = project.entities.find((e) => e.class.find((c) => c === 'Issue'))
      .href;

    const resp = await genericRequest(uri);

    const issuesProperties = resp.properties.issues.map((e) => e.properties);

    projectEntities.current.issues = issuesProperties;
    editProject.current.project.issues = issuesProperties;
  }, []);

  const getLabels = useCallback(async (project) => {
    const uri = project.entities.find((e) => e.class.find((c) => c === 'Label'))
      .href;

    const resp = await genericRequest(uri);

    const labelsProperties = resp.map((e) => e.properties);
    setLabelsTable((prevState) => {
      return { ...prevState, data: labelsProperties };
    });

    projectEntities.current.labels = labelsProperties;
    editProject.current.project.labels = labelsProperties;
  }, []);

  const getStates = useCallback(async (project) => {
    const uri = project.entities.find((e) => e.class.find((c) => c === 'State'))
      .href;

    const resp = await genericRequest(uri);
    const statesProperties = resp.map((e) => e.properties);
    const statesToSend = statesProperties.map((s) => ({
      ...s,
      transitionsTo: transformDataToSelector(statesProperties),
    }));

    setStateTable((prevState) => {
      return { ...prevState, data: statesToSend };
    });

    projectEntities.current.states = statesProperties;
    editProject.current.project.states = statesProperties;
  }, []);

  const handleOnEditProject = async () => {
    try {
      const url = project.links[0].href;

      await genericPutRequest(url, editProject.current.project);

      toast(<HashLink title='Edit successfully' />);
      setReadOnly(true);

      //await getProjectsDetails();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // getProjectsDetails(pName);
    async function onLoad() {
      const details = await genericRequest(props.location.pathname);
      getIssues(details);
      getLabels(details);
      getStates(details);

      setProject(details);
      editProject.current.project = { ...details.properties };
    }
    onLoad();
  }, [getIssues, getLabels, getStates, props.location.pathname]);

  const handleExpansionPanelChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleReadOnly = () => {
    setReadOnly(false);
  };

  const handleReset = () => {
    setReadOnly(true);
    setProject((current) => current);
    setExpanded(false);
  };

  const modalCallback = (newState) => {
    const dataToTable = {
      name: newState.name,
      initialState: newState.initialState,
      transitionsTo: transformDataToSelector(
        newState.transitionsTo.map((t) => ({ name: t }))
      ),
    };
    setStateTable((prevState) => {
      if (newState.initialState) {
        prevState.data.forEach((e) => (e.initialState = false));
      }
      const data = [...prevState.data];
      data.push(dataToTable);
      return { ...prevState, data };
    });
    if (newState.initialState) {
      editProject.current.project.states.forEach(
        (e) => (e.initialState = false)
      );
    }

    const stateToSave = {
      name: newState.name,
      initialState: newState.initialState,
      transitionsTo: newState.transitionsTo.map((t) => ({ name: t })),
    };
    editProject.current.project.states.push(stateToSave);

    setReadOnly(false);
    setOpen(false);
  };

  return (
    project && (
      <Box display='flex' width={700} margin={'auto'} border={1}>
        <div className={classes.root}>
          <Typography
            variant='h4'
            align='center'
            gutterBottom
            style={{ padding: '15px' }}
          >
            {project.properties.name}
          </Typography>
          <div>
            <TextField
              id='filled-full-width'
              label='Desciption'
              style={{ margin: 8, width: '85%' }}
              placeholder='Project Desciption'
              required
              onChange={(event) =>
                (editProject.current.project.description = event.target.value)
              }
              defaultValue={project.properties.description}
              InputProps={{
                readOnly: isEditable,
              }}
              variant={isEditable ? 'filled' : 'standard'}
            />
            <IconButton onClick={handleReadOnly} className={classes.margin}>
              <Edit fontSize='large' />
            </IconButton>
          </div>
          <ExpansionPanel
            key='pane1'
            style={{ display: 'flow-root !important' }}
            expanded={expanded === 'panel1'}
            onChange={handleExpansionPanelChange('panel1')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1bh-content'
              id='panel1bh-header'
            >
              <Typography className={classes.heading}>Issues</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {projectEntities.current.issues && (
                <IssueTable
                  project={{
                    name: project.properties.name,
                    description: project.properties.description,
                    entities: projectEntities,
                    url: project.actions[0].href,
                  }}
                />
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            key='pane2'
            style={{ display: 'flow-root !important' }}
            expanded={expanded === 'panel2'}
            onChange={handleExpansionPanelChange('panel2')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel2bh-content'
              id='panel2bh-header'
            >
              <Typography className={classes.heading}>Labels</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <MaterialTable
                icons={tableIcons}
                title={`Labels from ${project.properties.name}`}
                columns={labelsTable.columns}
                data={labelsTable.data}
                editable={{
                  // TODO EDIT
                  onRowAdd: (newData) =>
                    new Promise((resolve) => {
                      setTimeout(() => {
                        resolve();
                        setLabelsTable((prevState) => {
                          const data = [...prevState.data];
                          data.push(newData);
                          return { ...prevState, data };
                        });
                        editProject.current.project.labels.push(newData);
                        setReadOnly(false);
                      }, 600);
                      console.log('newData', newData);
                    }),
                  onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                      setTimeout(() => {
                        resolve();
                        setReadOnly(false);
                        setLabelsTable((prevState) => {
                          const data = [...prevState.data];
                          data.splice(data.indexOf(oldData), 1);
                          return { ...prevState, data };
                        });
                        const labels = [editProject.current.project.labels];
                        editProject.current.project.labels.splice(
                          labels.indexOf(oldData),
                          1
                        );
                      }, 600);
                    }),
                }}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            key='pane3'
            style={{ display: 'flow-root !important' }}
            expanded={expanded === 'panel3'}
            onChange={handleExpansionPanelChange('panel3')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel3bh-content'
              id='panel3bh-header'
            >
              <Typography className={classes.heading}>States</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <MaterialTable
                icons={tableIcons}
                title={`States from ${project.properties.name}`}
                columns={stateTable.columns}
                data={stateTable.data}
                actions={[
                  {
                    icon: AddBox,
                    onClick: () => setOpen(true),
                    isFreeAction: true,
                    tooltip: 'Add State',
                  },
                ]}
                editable={{
                  onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                      setTimeout(() => {
                        resolve();
                        setStateTable((prevState) => {
                          const data = [...prevState.data];
                          data.splice(data.indexOf(oldData), 1);
                          return { ...prevState, data };
                        });
                        setReadOnly(false);
                        const states = editProject.current.project.states.findIndex(
                          (s) => s.name === oldData.name
                        );
                        editProject.current.project.states.splice(states, 1);
                      }, 600);
                    }),
                }}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby='simple-modal-title'
            aria-describedby='simple-modal-description'
          >
            <StateModal states={stateTable} updateState={modalCallback} />
          </Modal>
          {!isEditable && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                padding: '10px',
              }}
            >
              <Button
                onClick={handleOnEditProject}
                variant='contained'
                color='primary'
                disableElevation
                type='submit'
              >
                save
              </Button>
              <Button onClick={handleReset}>reset</Button>
            </div>
          )}
        </div>
      </Box>
    )
  );
};

export default ProjectDetail;
