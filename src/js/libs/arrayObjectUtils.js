import fetch from 'unfetch'
import Handlebars from 'handlebars/dist/handlebars'
import { groupBy } from './libs/arrayObjectUtils.js'


fetch(`${process.env.PATH}/assets/data/mags.json`).then(resp => resp.json())
.then(arr => {
		const a = getData(arr);

		console.log (a);
});

function getData(arr){
	
	var newObj = {};
	var magsArr = [];
	arr.map(function(mag,i) {
	  if(mag.Rank){
	  	mag.keyRef = i;
	  	mag.months= [mag['January 2017'],mag['February 2017'],mag['March 2017'],mag['April 2017'],mag['May 2017'],mag['June 2017'],mag['July 2017'],mag['August 2017'],mag['September 2017'],mag['October 2017'],mag['November 2017'],mag['December 2017']]
	  	magsArr.push(mag);
	  }
	});

	return magsArr;
}
