import React from 'react'

import { TextField, Button, InputAdornment, makeStyles, createStyles } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import { green } from '@material-ui/core/colors';

interface ComponentProps {
    children?: React.ReactNode,
    disabled?: boolean
    onClick?: (event: React.FormEvent) => void,
    startIcon?: React.ReactNode,
    type?: 'submit' | 'reset' | 'button';
    variant?: "text" | "outlined" | "contained" | undefined,
}

const useStyles = makeStyles(() => createStyles({
    submitButton: {
        color: '#FFF',
        backgroundColor: green[600],
        '&:hover': {
            backgroundColor: green[700],
        }
    },
}))

export default function GreenButton(props: ComponentProps) {

    const muiStyles = useStyles()

    return (
        <Button disabled={props.disabled} onClick={props.onClick} type={props.type} variant={props.variant || 'contained'} className={muiStyles.submitButton} startIcon={props.startIcon}>{props.children}</Button>
    )
}
