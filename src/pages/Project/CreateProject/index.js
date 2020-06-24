import React, { useState, Fragment, useCallback, useEffect } from 'react';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Dropdown } from 'semantic-ui-react';
import {
  Box,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  makeStyles,
  Radio,
  TextField,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { toast } from 'react-toastify';

import { genericPostRequest, templateRequest } from '../../../api/actions';
import Button from '../../../components/button';
import { transformDataToSelector } from '../../../helpers';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export const CreateProject = (props) => {
  const [url, setUrl] = useState('');

  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  const [initialState, setInitialState] = useState('states[0].name');

  const getTemplate = useCallback(async () => {
    const template = await templateRequest();
    setUrl(template.baseUriTemplate);
  }, []);

  useEffect(() => {
    if (!props.location.state) {
      getTemplate();
      return;
    }

    setUrl(props.location.state[0].href);
  }, [getTemplate, props]);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setError,
    errors,
    clearError,
    reset,
  } = useForm({
    defaultValues: {
      labels: [{}],
      states: [{}],
    },
  });

  const {
    fields: labelFields,
    append: labelAppend,
    remove: labelRemove,
  } = useFieldArray({
    control,
    name: 'labels',
  });

  const {
    fields: stateFields,
    append: stateAppend,
    remove: stateRemove,
  } = useFieldArray({
    control,
    name: 'states',
  });

  const handleCreateProject = async (project) => {
    const res = await genericPostRequest(url, project);
    return res;
  };

  const handlePanelChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAppend = (appendInput, value) => {
    clearError();

    if (!getValues(value)) {
      setError([
        {
          type: 'required',
          name: value,
          message: 'Insert or remove',
        },
      ]);

      return;
    }
    appendInput();
  };

  const handleRemove = (removeInput, index) => {
    if (index === 0) {
      return;
    }
    removeInput(index);
  };

  const renderLabelInputs = () => {
    return labelFields.length ? (
      labelFields.map((item, index) => (
        <Fragment key={item.id}>
          <TextField
            error={errors.labels && errors.labels[index]}
            helperText={
              errors.labels &&
              errors.labels[index] &&
              errors.labels[index].name.message
            }
            required
            label='Label'
            id='standard-required'
            placeholder='Project Label'
            name={`labels[${index}].name`}
            inputRef={register()}
          />
          <i
            onClick={() => handleRemove(labelRemove, index)}
            aria-hidden='true'
            className='minus icon'
          ></i>
          <i
            onClick={() => handleAppend(labelAppend, `labels[${index}].name`)}
            aria-hidden='true'
            className='plus icon'
          ></i>
        </Fragment>
      ))
    ) : (
      <i onClick={labelAppend} aria-hidden='true' className='plus icon'></i>
    );
  };

  const handleInitialState = (event) => {
    setInitialState(event.target.value);
  };

  const renderStateInputs = () => {
    return stateFields.length ? (
      stateFields.map((item, index) => (
        <div key={item.id}>
          <Radio
            checked={initialState === `states[${index}].name`}
            onChange={handleInitialState}
            value={`states[${index}].name`}
            name={`states[${index}].initialState`}
            inputRef={register()}
          />
          <TextField
            error={errors.states && errors.states[index]}
            helperText={
              errors.states &&
              errors.states[index] &&
              errors.states[index].name.message
            }
            label='State'
            required
            id='standard-required'
            placeholder='Project State'
            name={`states[${index}].name`}
            inputRef={register()}
          />
          <i
            onClick={() => handleRemove(stateRemove, index)}
            aria-hidden='true'
            className='minus icon'
          ></i>
          <i
            onClick={() => handleAppend(stateAppend, `states[${index}].name`)}
            aria-hidden='true'
            className='plus icon'
          ></i>
        </div>
      ))
    ) : (
      <i onClick={stateAppend} aria-hidden='true' className='plus icon'></i>
    );
  };

  const handleTransitions = () => {
    const { states } = getValues({ nest: true });
    if (!states) {
      return;
    }

    const validTransitions = transformDataToSelector(states);

    return states
      .filter((s) => s.name)
      .map((item, index) => {
        return (
          <div key={item.name}>
            <label>{item.name}</label>
            <Controller
              name={`states[${index}].transitionsTo`}
              control={control}
              defaultValue={[]}
              onChange={([e, data]) => {
                return data.value;
              }}
              as={
                <Dropdown
                  fluid
                  multiple
                  search
                  selection
                  options={validTransitions}
                />
              }
            ></Controller>
          </div>
        );
      });
  };

  const HashLink = ({ closeToast, to, title }) => {
    return (
      <a href={to} onClick={closeToast}>
        {title}
      </a>
    );
  };

  const handleOnSubmit = async (data) => {
    const { states } = data;

    const statesToSend =
      states &&
      states.map((s) => ({
        ...s,
        initialState: !!s.initialState,
        transitionsTo: s.transitionsTo.map((t) => ({ name: t })),
      }));

    const project = {
      name: data.name,
      description: data.description,
      states: statesToSend,
      labels: data.labels && data.labels.filter((l) => l),
    };

    const newProject = await handleCreateProject(project);

    toast(<HashLink to={newProject.links[0].href} title={project.name} />);

    reset();
  };

  return (
    <Box display='flex' width={700} height={80} margin={'auto'}>
      <form
        className={classes.root}
        autoComplete='off'
        onSubmit={handleSubmit((data) => handleOnSubmit(data))}
      >
        <div>
          <TextField
            required
            id='standard-required'
            label='Required'
            placeholder='Project Name'
            helperText='Project Name'
            name='name'
            inputRef={register()}
          />
          <TextField
            required
            id='standard-required'
            label='Required'
            placeholder='Project Description'
            helperText='Project Description'
            name='description'
            inputRef={register()}
          />
        </div>
        <div>{renderLabelInputs()}</div>
        <div>{renderStateInputs()}</div>
        <div className={classes.root}>
          <ExpansionPanel
            style={{ display: 'flow-root !important' }}
            expanded={expanded === 'panel1'}
            onChange={handlePanelChange('panel1')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography className={classes.heading}>
                Set State Transictions
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {handleTransitions()}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
        <Button type='submit'>Submit</Button>
      </form>
    </Box>
  );
};
