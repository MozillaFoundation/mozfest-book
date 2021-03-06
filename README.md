
# MozFest Book
This project was developed by Jeroen Braspenning, concept and design by HeyHeydeHaas.

### Texts and Media
Most of the texts can be changed in the /public/data json files. These files are generated by an offline CMS.
If there are many changes it's best to handle this through the offline CMS. HeyHeydeHaas <office@heyheydehaas.com> or mail@jeroenbraspenning.nl has more information about this setup.

All media which can be found in the /public/media folder has been sized by this offline CMS as well.

### Development
To start development
1. run: npm install
2. run: npm run start

### Deploying
If changes were made in the cms:

1. run: npm run download:all

Deploying:
1. run: npm run build
2. push changes to the remote main branch

By pushing the changes to the "main" branch an automatic deploy is started and everything inside the /build folder is pushed
to AWS -> https://book.mozillafestival.org/

### Config
The system can use an offline CMS or JSON files for content sourcing.
To use the offline CMS (limited available) change the react_app_data_method var in the environment variable. 
- REACT_APP_DATA_METHOD=wordpress uses the offline cms
- REACT_APP_DATA_METHOD=json uses the json files in /public/data

When using the cms, make sure that REACT_APP_DATA_URL points to the url of the CMS

# Create React App
This project uses "create react app", check the standard documentation found below
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Available Scripts
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More
You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
To learn React, check out the [React documentation](https://reactjs.org/).