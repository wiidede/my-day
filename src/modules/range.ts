import { Range } from 'vue-range-multi'
import type { UserModule } from '~/types'
import 'vue-range-multi/style.css'

export const install: UserModule = ({ app }) => {
  app.component('TheRange', Range)
}
