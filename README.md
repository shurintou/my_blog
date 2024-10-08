# my blog
![react](https://img.shields.io/badge/react-%5E18.0.0-blue) ![antd](https://img.shields.io/badge/antd-%5E4.21.0-red) ![gitalk](https://img.shields.io/badge/gitalk-%5E1.7.2-green) ![markdown](https://img.shields.io/badge/react--markdown-%5E8.0.3-orange) ![typescript](https://img.shields.io/badge/typescript-%5E4.6.3-9cf) ![axios](https://img.shields.io/badge/axios-%5E0.26.1-yellowgreen) ![License](https://img.shields.io/badge/license-MIT-yellow)

:link:**URL: [https://shurintou.github.io](https://shurintou.github.io)**

![](https://github.com/shurintou/shurintou.github.io/blob/master/image/readme/screenshot.gif)

## :house:What is it ?

This is my blog project which was developed by [React](https://reactjs.org/) and bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## :bulb:Anything special ?

### Customized theme
The project can config design theme by using [craco](https://ant.design/docs/react/use-with-create-react-app#Advanced-Guides), to try this, please modify the `craco.config.ts` file in the project.

### Database-free
All posts of the blog are stored as [Github issue](https://github.com/shurintou/shurintou.github.io/issues), and comments are synchronized by [Gitalk](https://github.com/gitalk/gitalk). 

### Trilingual contents
The UI parts of the blog can be displayed in three languages(`English`, `Simplified Chinese` and `Japanese`) by changing the setting, and each languages has its original post contents.

### SPA with browserHistory
Though the project is developed as a single page application(`SPA`), the browserHistory can totally work at each operation you have made, and copying an URL can get the exact same result as the copied one. 

### filter/search posts 
Posts can be filtered by `categories`(memo, technic, ...), `tags`(Java, Javascript, ...), and `languages`(English, Japanese, Chinese), or searched by any keyword you are interested.

## :key:How does it work ?

Clone this repository to you local computer and in the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
The app is ready to be deployed and [here](https://github.com/shurintou/shurintou.github.io) is the github repository where I store it.
