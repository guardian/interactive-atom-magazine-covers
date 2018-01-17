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
{title:"Cosmopolitan",slot:1,publisher:"Hearst"},
{title:"Elle (U.K.)",slot:2,publisher:"Hearst"},
{title:"Glamour",slot:3,publisher:"Conde Nast"},
{title:"Good Housekeeping",slot:4,publisher:"Hearst"},
{title:"GQ",slot:5,publisher:"Conde Nast"},
{title:"HELLO! Fashion Monthly",slot:6,publisher:"Hello Magazine"},
{title:"HomeStyle",slot:7,publisher:"Hubert Burda Media"},
{title:"Living etc",slot:8,publisher:"Time Inc UK"},
{title:"Marie Claire",slot:9,publisher:"Time Inc UK"},
{title:"Men's Health",slot:10,publisher:"Hearst"},
{title:"Prima",slot:11,publisher:"Hearst"},
{title:"Red",slot:12,publisher:"Hearst"},
{title:"Slimming World Magazine",slot:13,publisher:"Slimming World"},
{title:"Take a Break Special",slot:14,publisher:"Bauer"},
{title:"Vogue",slot:15,publisher:"Conde Nast"},
{title:"Weight watchers Magazine",slot:16,publisher:"Seven Publishing Group"},
{title:"Woman & Home",slot:17,publisher:"Time Inc UK"},
{title:"Women's Health",slot:18,publisher:"Hearst"},
{title:"Your Home",slot:19,publisher:"Hubert Burda Media"}
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
        t.coversPeopleTotal = t.objArr['Total covers with people'];
        t.coversW = Number(t.objArr['Total white']);
        t.coversB = Number(t.objArr['Total Black']);
        t.coversA = Number(t.objArr['Total asian']);
        t.coversL = Number(t.objArr['Total Latino']);


        spriteSlots.map(function(mag) {
            
            if (mag.title == t.Title){
                t.spriteSlot = mag.slot - 1;
                t.publisher = mag.publisher;
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
