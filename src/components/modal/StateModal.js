import React, { useState, forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Checkbox } from '@material-ui/core';
import { Dropdown } from 'semantic-ui-react';
import Button from '../button';
import { transformDataToSelector } from '../../helpers';
import { useStyles } from '../../helpers/styles';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function StateModal(props, ref) {
  const [modalStyle] = useState(getModalStyle);
  const states = props.states.data;
  const classes = useStyles();
  const [initialState, setInitialState] = useState(false);

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      states: [{}],
    },
  });

  const handleTransitions = () => {
    if (!states) {
      return;
    }

    const validTransitions = transformDataToSelector(states);

    return (
      <div>
        <Controller
          name={`transitionsTo`}
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
  };

  const handleOnSubmit = (data) => {
    props.updateState(data);
  };

  return (
    <form
      className={classes.root}
      autoComplete='off'
      onSubmit={handleSubmit((data) => handleOnSubmit(data))}
    >
      <div style={modalStyle} className={classes.paper}>
        <h2 id='simple-modal-title'>Create State</h2>
        <TextField
          style={{ padding: '10px' }}
          label='State'
          required
          id='standard-required'
          placeholder='Project State'
          name='name'
          inputRef={register()}
        />
        <Checkbox
          checked={initialState}
          label='Initial State'
          onChange={() => setInitialState(initialState ? false : true)}
          value={initialState}
          name='initialState'
          inputRef={register()}
        />
        {handleTransitions()}
        <Button type='submit'>Submit</Button>
      </div>
    </form>
  );
}
export default forwardRef(StateModal);
