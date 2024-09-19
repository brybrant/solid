import eslintPluginSolid from 'eslint-plugin-solid';

import { eslintConfig } from '@brybrant/configs';

export default eslintConfig(eslintPluginSolid.configs['flat/recommended']);
