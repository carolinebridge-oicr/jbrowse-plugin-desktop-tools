import PluginManager from '@jbrowse/core/PluginManager'
import { AddTrackWorkflowType } from '@jbrowse/core/pluggableElementTypes'
import { types } from 'mobx-state-tree'

// locals
import BCFToolsAddTrackWidget from './BCFToolsAddTrackWidget'

export default (pm: PluginManager) => {
  pm.addAddTrackWorkflowType(
    () =>
      new AddTrackWorkflowType({
        name: 'Raw variant track',
        ReactComponent: BCFToolsAddTrackWidget,
        stateModel: types.model({}),
      }),
  )
}
