import React, { useEffect, useState } from 'react'
import { Button, Paper, TextField } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { getSession } from '@jbrowse/core/util'
import { AddTrackModel } from '@jbrowse/plugin-data-management'
import { LocalPathLocation, FileLocation } from '@jbrowse/core/util/types'
import { isElectron } from '@jbrowse/core/util'
import LocalFileChooser from './LocalFileChooser'

const useStyles = makeStyles()((theme) => ({
  textbox: {
    width: '100%',
  },
  paper: {
    margin: theme.spacing(),
    padding: theme.spacing(),
  },
  submit: {
    marginTop: 25,
    marginBottom: 25,
    display: 'block',
  },
}))

const exec = isElectron ? require('child_process').exec : () => {}

function execute(command: any, callback: any) {
  exec(command, (error: any, stdout: any, stderr: any) => {
    callback(stdout)
  })
}

export default function BCFToolsAddTrackWidget({
  model,
}: {
  model: AddTrackModel
}) {
  const { classes } = useStyles()
  const [trackName, setTrackName] = useState(
    model.trackName !== '' ? model.trackName : `myvcf - ${Date.now()}`,
  )

  useEffect(() => {
    setTrackName(model.trackName)
  }, [model.trackData])

  return (
    <Paper className={classes.paper}>
      <p>
        This desktop plugin widget will allow you to submit an unindexed{' '}
        <code>.vcf</code> file to JBrowse which will then use a script to sort,
        index, and zip the file. This circumvents any CLI operations you may
        have otherwise needed to do!
      </p>
      <LocalFileChooser
        location={model.trackData}
        setLocation={model.setTrackData}
        setName={setTrackName}
      />
      <TextField
        value={trackName}
        onChange={(event) => setTrackName(event.target.value)}
        helperText="Track name"
      />
      <Button
        variant="contained"
        className={classes.submit}
        onClick={() => {
          const session = getSession(model)

          const trackId = [
            `${model.trackName}-${Date.now()}`,
            `${session.adminMode ? '' : '-sessionTrack'}`,
          ].join('')

          function isLocalPathLocation(
            location: FileLocation,
          ): location is LocalPathLocation {
            return 'localPath' in location
          }

          // @ts-ignore
          const localPath = isLocalPathLocation(model.trackData)
            ? model.trackData.localPath
            : ''

          execute(
            `bcftools sort "${localPath}" > "${localPath}.sorted.vcf" && bgzip "${localPath}.sorted.vcf" && tabix "${localPath}.sorted.vcf.gz"`,
            () => {
              model.setTrackData({
                localPath: `${localPath}.sorted.vcf.gz`,
                locationType: 'LocalPathLocation',
              })

              model.setIndexTrackData({
                localPath: `${localPath}.sorted.vcf.gz.tbi`,
                locationType: 'LocalPathLocation',
              })

              // @ts-ignore
              session.addTrackConf({
                trackId,
                type: 'VariantTrack',
                name: trackName,
                assemblyNames: [model.assembly],
                adapter: {
                  type: 'VcfTabixAdapter',
                  vcfGzLocation: model.trackData,
                  index: { location: model.indexTrackData },
                },
              })
              model.view?.showTrack(trackId)

              model.clearData()
              // @ts-ignore
              session.hideWidget(model)
            },
          )
        }}
      >
        Submit
      </Button>
    </Paper>
  )
}
