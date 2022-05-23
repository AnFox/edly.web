import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Paper } from "@material-ui/core"
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(16),
      padding: theme.spacing(16),
    },
  },
}))

export default function Card(props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Paper>
        {props.children}
      </Paper>
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node
}
