import type { Configuration } from 'webpack';
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import * as path from 'path';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

const rendererConfig: Configuration = {
  target: 'electron-renderer',
  module: {
    rules: [
      ...rules,
      // Rule for handling images
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: 'file-loader',
              name: 'static/images/[name].[ext]',
            },
          },
        ],
      },
      // Rule for handling fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: 'file-loader',
              name: 'static/fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
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
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};

export default rendererConfig;
