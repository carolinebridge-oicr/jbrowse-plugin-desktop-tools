import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import { version } from '../package.json'
import { isElectron } from '@jbrowse/core/util'
import BCFToolsAddTrackWidgetF from './BCFToolsAddTrackWidget'

export default class DesktopToolsPlugin extends Plugin {
  name = 'DesktopToolsPlugin'
  version = version

  install(pluginManager: PluginManager) {
    if (isElectron) {
      BCFToolsAddTrackWidgetF(pluginManager)
    }
  }

  configure() {}
}
