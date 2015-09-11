"use strict";

var React = require('react');

var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var Redirect = Router.Redirect;

var routes = (
		<Route name="app" path="/" handler={require('./components/app')}>
			<DefaultRoute handler={require('./components/homePage')} />
			<Route name="authors" handler={require('./components/authors/authorPage')} />
			<Route name="addAuthor" path="author" handler={require('./components/authors/manageAuthorPage')} />
			<Route name="about" handler={require('./components/about/aboutPage')} />
			<NotFoundRoute handler={require('./components/NotFoundPage')} />
			<Redirect from="about-us" to="about" /> 	// no longer existing pages
			<Redirect from="awthurs" to="authors" /> 	// mis-spellings
			<Redirect from="about/*" to="about" /> 		// no longer existing sections
		</Route>
);

module.exports = routes;
