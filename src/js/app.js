import fetch from 'unfetch'
import Handlebars from 'handlebars/dist/handlebars'
import mainTemplate from '../templates/main.html'
import magItemTemplate from '../templates/magItem.html'
import gridPicTemplate from '../templates/gridPic.html'

fetch(`${process.env.PATH}/assets/data/mags.json`).then(resp => resp.json())
.then(arr => {
		const a = getData(arr);
		var compiledHTML = compileHTML(a);
		document.querySelector("#mainView").innerHTML = compiledHTML;
		
});

const spriteSlots = [
{title:"Cosmopolitan",slot:1},
{title:"Elle (U.K.)",slot:2},
{title:"Glamour",slot:3},
{title:"Good Housekeeping",slot:4},
{title:"GQ",slot:5},
{title:"HELLO! Fashion Monthly",slot:6},
{title:"HomeStyle",slot:7},
{title:"Living etc",slot:8},
{title:"Marie Claire",slot:9},
{title:"Men's Health",slot:10},
{title:"Prima",slot:11},
{title:"Red",slot:12},
{title:"Slimming World Magazine",slot:13},
{title:"Take a Break Special",slot:14},
{title:"Vogue",slot:15},
{title:"Weight watchers Magazine",slot:16},
{title:"Woman & Home",slot:17},
{title:"Women's Health",slot:18},
{title:"Your Home",slot:19}
];

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

	let magsDataArr = sortByKeys(magsArr);

	newObj.magsData = magsDataArr;

	return newObj;
}

function compileHTML(dataIn) {

    Handlebars.registerHelper('html_decoder', function(text) {
        var str = unescape(text).replace(/&amp;/g, '&');
        return str;
    });

    Handlebars.registerPartial({
    	'magItem': magItemTemplate,
        'gridPic': gridPicTemplate
    });

    var content = Handlebars.compile(
        mainTemplate, {
            compat: true
        }
    );

    var newHTML = content(dataIn);

    return newHTML

}


function sortByKeys(obj) {
    let keys = Object.keys(obj), i, len = keys.length;

    keys.sort();

    var a = []

    for (i = 0; i < len; i++) {
        let k = keys[i];
        let t = {}
        t.sortOn = k;       
        t.objArr = obj[k];
        t.Title = t.objArr.Title;
        t.monthsArr = [];
        t.sortTitle = removeWhitespace(t.objArr.Title);

        spriteSlots.map(function(mag) {
            
            if (mag.title == t.Title){
                t.spriteSlot = mag.slot - 1;
            }
        })
      
        t.objArr.months.map(function(month,n) {
        	console.log(n * 9.1)
        	var monthObj = {};
        	monthObj.desktopOffsetTop = t.spriteSlot * 5.265; //percentage
        	monthObj.desktopOffsetLeft = n * 9.1; //percentage
        	monthObj.personColor = month.split("/").join("-").toLowerCase();
            if(monthObj.personColor=="-"){ monthObj.personColor="no-color" } ;
        	t.monthsArr.push(monthObj)

        });

        a.push(t);
    }

    console.log(a)

    return a;
}

function removeWhitespace(s){
	var o = s.split(" ").join("-");
	o = o.split("(U.K)").join("-");
	o = o.split("'").join("-");
	o = o.split(".").join("-");
	return o;

}
