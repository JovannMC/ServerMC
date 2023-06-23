import type { Configuration } from 'webpack';
import { plugins } from './webpack.plugins';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import { rules } from './webpack.rules';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: {
    main: './src/index.ts',
  },
  module: {
    rules: [
      ...rules,
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {}
        }]
      }
    ]
    
  },
  plugins: [
    ...plugins,
    // Plugin for copying static files
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/static',
          to: 'static',
          globOptions: {
            ignore: ['**/*.html'],
          },
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};