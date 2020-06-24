import React, { useState, Fragment } from 'react';
import MaterialTable from 'material-table';
import { useForm } from 'react-hook-form';
import { AddBox, Visibility } from '@material-ui/icons';
import { toast } from 'react-toastify';

import {
  Modal,
  Button,
  TextField,
  Checkbox,
  Radio,
  FormControlLabel,
} from '@material-ui/core';

import { tableIcons } from '../Icons';
import { useStyles, customModalStyle } from '../../helpers/styles';
import { genericPostRequest } from '../../api/actions';
import { HashLink } from '../toast';

const IssueTable = (props) => {
  const { labels, states } = props.project.entities.current;

  const classes = useStyles();
  const getModalStyle = customModalStyle();

  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [stateChoise, setStateChoise] = useState();

  const createIssue = async (url, body) => {
    try {
      const issue = await genericPostRequest(url, body);
      console.log(issue);

      toast(
        <HashLink to={issue.links[0].href} title={issue.properties.name} />
      );
    } catch (error) {
      // TODO fix error
      console.log(error);
    }
  };

  const { register, handleSubmit } = useForm({
    defaultValues: {
      issue: {},
    },
  });

  const [issuesTable, setIssuesTable] = useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
    ],
    data: props.project.entities.current.issues,
  });

  const renderStatesButtons = () => {
    if (states) {
      const initial = states.find((s) => s.initialState).name;
      if (!stateChoise) {
        setStateChoise(initial);
      }
      return states.map((item, index) => (
        <div key={index}>
          <FormControlLabel
            required
            value={`states[${index}].name`}
            control={
              <Radio
                checked={stateChoise === item.name}
                onChange={(event) => {
                  setStateChoise(event.target.value);
                }}
                value={item.name}
                inputRef={register()}
              />
            }
            label={item.name}
            name={`state.name`}
            inputRef={register()}
          />
        </div>
      ));
    }
  };

  const handleOnSubmit = (resp) => {
    const body = {
      ...resp,
      labels: resp.labels.filter((l) => l.name),
    };

    const dataToTable = {
      id: 55,
      name: resp.name,
      description: resp.description,
    };

    createIssue(props.project.url, body);

    setIssuesTable((prevState) => {
      const data = [...prevState.data];
      data.push(dataToTable);
      return { ...prevState, data };
    });

    setOpen(false);
  };

  const body = (
    <form
      className={classes.root}
      autoComplete='off'
      onSubmit={handleSubmit((data) => {
        handleOnSubmit(data);
      })}
    >
      <div style={modalStyle} className={classes.paper}>
        <h2 id='simple-modal-title'>Create Issue</h2>
        <TextField
          style={{ padding: '10px' }}
          label='Name'
          required
          placeholder='Issue Name'
          name='name'
          inputRef={register()}
        />
        <TextField
          style={{ padding: '10px' }}
          label='Description'
          required
          placeholder='Issue Description'
          name='description'
          inputRef={register()}
        />
        {labels &&
          labels.map((item, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  name={`labels[${index}].name`}
                  value={item.name}
                  inputRef={register()}
                />
              }
              label={item.name}
            />
          ))}
        {renderStatesButtons()}
        <Button
          variant='contained'
          color='primary'
          disableElevation
          type='submit'
        >
          Save
        </Button>
      </div>
    </form>
  );

  return (
    <>
      <MaterialTable
        icons={tableIcons}
        title={`Issues from ${props.project.name}`}
        columns={issuesTable.columns}
        data={issuesTable.data}
        actions={[
          {
            icon: Visibility,
            tooltip: 'View Issue',
            onClick: (event, rowData) =>
              alert('Not yet Implemented for ' + rowData.name),
          },
          {
            icon: AddBox,
            onClick: () => setOpen(true),
            isFreeAction: true,
            tooltip: 'Add Issue',
          },
        ]}
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {body}
      </Modal>
    </>
  );
};
export default IssueTable;
