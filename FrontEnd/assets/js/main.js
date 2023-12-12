import {configServerAddress} from '../config/config.js';
import {getAllWorks, getAllCategories} from './req-api/requetes.js';
import {genererProjetsDom, genererFiltresDom} from './display-dom/display-projects.js';

/* Global session vars = */
/* ------------ */

let url = await configServerAddress(); // get actual host adress ; beta, dev, prod

let projets = await getAllWorks(url); // api request  to get all projects

let categories = await getAllCategories(url); //api request  to get all categories

genererProjetsDom(projets); //display projects on the website

genererFiltresDom(categories,projets); //display categories filters on the website