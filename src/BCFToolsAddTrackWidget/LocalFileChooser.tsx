import React, { useState } from 'react'
import { Box, Button, Typography, FormControl } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { isElectron } from '@jbrowse/core/util'
import { FileLocation, BlobLocation } from '@jbrowse/core/util/types'
import { getBlob, storeBlobLocation } from '@jbrowse/core/util/tracks'

function isBlobLocation(location: FileLocation): location is BlobLocation {
  return 'blobId' in location
}

const useStyles = makeStyles()((theme) => ({
  filename: {
    marginLeft: theme.spacing(1),
  },
}))

function LocalFileChooser(props: {
  location?: FileLocation
  setLocation: Function
}) {
  const { classes } = useStyles()
  const { location, setLocation } = props
  const [filename, setFilename] = useState(``)

  const needToReload =
    location && isBlobLocation(location) && !getBlob(location.blobId)

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box>
        <FormControl fullWidth>
          <Button variant="outlined" component="label">
            Choose File
            <input
              key="bcftools-filechooser"
              type="file"
              hidden
              onChange={({ target }) => {
                const file = target && target.files && target.files[0]
                if (file) {
                  if (isElectron) {
                    setLocation({
                      localPath: (file as File & { path: string }).path,
                      locationType: 'LocalPathLocation',
                    })
                  } else {
                    setLocation(storeBlobLocation({ blob: file }))
                  }
                  setFilename((file as File & { path: string }).path)
                }
              }}
            />
          </Button>
        </FormControl>
      </Box>
      <Box>
        <Typography
          component="span"
          className={classes.filename}
          color={filename ? 'initial' : 'textSecondary'}
        >
          {filename || 'No file chosen'}
        </Typography>
        {needToReload ? (
          <Typography color="error">(need to reload)</Typography>
        ) : null}
      </Box>
    </Box>
  )
}

export default LocalFileChooser
