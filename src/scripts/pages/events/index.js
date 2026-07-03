import {SIGNUP_URL} from '../../constants.js'; 
// use constants
let signups = document.getElementsByClassName("signup-link");  
// fill page links
for (let i=0; i<signups.length; i++) {
	signups[i].setAttribute("href", SIGNUP_URL);	
}; // maybe move this to run on every page — just make sure the links have the right class if any new ones are made. 

// import carousel data
//import data from "./events_info.json" assert {type: 'json'};
var slide_data = [];

// returns a promise; make sure to handle it with a .then().
async function importData() {
    const response = await fetch('./scripts/pages/events/events_info.json');
    const data = await response.json();
    return data; // Return the data after it has been fetched
}

function splitIntoSublists(arr, perSplice) {
	// chatgpt code
	var result = [];
	var sublist = [];
	var tri_count = 1
	var i = 0;
	while (i < arr.length) {
		sublist.push(arr[i]);
		i++
		if (tri_count < perSplice) {
			tri_count++
		} else {
			/// if just added last item of current sublist
			tri_count = 1;
			result.push(sublist.copyWithin());
			sublist = [];
			if (i+perSplice >= arr.length) {
				for (let j = i; j<arr.length; j++) {
					sublist.push(arr[j]);
				}
				result.push(sublist.copyWithin());
				break;
			}
		}
	}
	return result;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// slide_data = [
//     [    // page 1
//         {"name":"test_event_0", "date":"0/1/1234",  "content":"This is a description of the event or announcement."},
//         {"name":"test_event_1", "date":"0/1/1234",  "content":"This is a description of the event or announcement."},
//         {"name":"test_event_2", "date":"0/1/1234",  "content":"This is a description of the event or announcement."}
//     ], [ // page 2                                  
//         {"name":"test_event_3", "date":"0/1/1234",  "content":"This is a description of the event or announcement."},
//         {"name":"test_event_4", "date":"0/1/1234",  "content":"This is a description of the event or announcement."},
//         {"name":"test_event_5", "date":"0/1/1234",  "content":"This is a description of the event or announcement."}
//     ], [ // page 3                                  
//         {"name":"test_event_6", "date":"0/1/1234",  "content":"This is a description of the event or announcement."},
//         {"name":"test_event_7", "date":"0/1/1234",  "content":"This is a description of the event or announcement."},
//         {"name":"test_event_8", "date":"0/1/1234",  "content":"This is a description of the event or announcement."}
//     ], [ // page 4                                  
//         {"name":"test_event_9", "date":"0/1/1234",  "content":"This is a description of the event or announcement."},
//         {"name":"test_event_10", "date":"0/1/1234", "content":"This is a description of the event or announcement."},
//         {"name":"test_event_11", "date":"0/1/1234", "content":"This is a description of the event or announcement."}
//     ]
// ] 

// directions
const NEXT = 1;
const PREV = -1;
/*********************
* ITERATE PAGE IDX
* direction = an integer of 1 (right becomes current) or -1 (left becomes current)
**********************/
function getNextPageIdx(direction) {
    console.assert(direction == 1 || direction == -1,`ERROR: getNextPageIdx was given invalid parameters: '${direction}' (type=${typeof(direction)}) is not 1 or -1`);
    let pageIndex = current_page + direction;
    if (pageIndex >= slide_data.length) {
        return 0;
    } else if (pageIndex < 0) {
        return slide_data.length-1;
    } else {
		return pageIndex;
	}
}

function populateNode(node, pageIdx) {
    /*
    <article class="event-item item-box">
        <h3>Event item prev</h3>
        <p>time/place<br />Description of Event</p>
    </article>
    */
    
    let html_content = "";
    let page = slide_data[pageIdx];
    
    // loop through page items
    for (let itemIdx = 0; itemIdx < page.length; itemIdx++) {
        let item = page[itemIdx];
        
        // create article and add content with specified structure.
        let item_html = '<article class="event-item item-box">'
            + `<h2>${item['name']}</h2>`
            + `<p class="event-time">${item["date"]}</p>`
            + `<p class="event-content">${item["content"]}</p>`
            + '</article>';
        html_content += item_html; // add item to page
    }
	node.innerHTML = html_content;
}


////MOVE ITEMS
const slideLClass = 'event-page-sliding-l';
const slideRClass = 'event-page-sliding-r';
/*——————————————————————————————————————————————————————————————————————
 | SLIDE RIGHT
 | Slides the carousel so that the right page becomes the current page, 
 | and the current page becomes the left page.
 +—————————————————————————————————————————————————————————————————————*/
async function slideRight() {
	let prevClass = 'prev-page';
	let curClass = 'current-page';
	let nextClass = 'next-page';

	let prev_page = document.getElementsByClassName(prevClass)[0];
	let cur_page = document.getElementsByClassName(curClass)[0];
	let next_page = document.getElementsByClassName(nextClass)[0];

	////MOVE ITEMS LEFT
	// add class with sliding properties (including translateX(-100%))
	cur_page.classList.add(slideRClass);
	next_page.classList.add(slideRClass);

	await sleep(500); // same time as transition duration

	// remove class with movement properties
	next_page.classList.remove(slideRClass);
	cur_page.classList.remove(slideRClass);

	// move prev to next 
	prev_page.parentNode.appendChild(prev_page);
	// update current page index
	current_page = getNextPageIdx(NEXT);
	// automatically repopulate with next page content
	populateNode(prev_page, getNextPageIdx(NEXT));

	//// adjust class markers for prev, cur, and next
	// prev to next
	prev_page.classList.remove(prevClass);
	prev_page.classList.add(nextClass);
	// cur to prev
	cur_page.classList.remove(curClass);
	cur_page.classList.add(prevClass);
	// next to cur
	next_page.classList.remove(nextClass);
	next_page.classList.add(curClass);
}


/*——————————————————————————————————————————————————————————————————————
 | SLIDE LEFT
 | Slides the carousel so that the left page becomes the current page, 
 | and the current page becomes the right page.
 +—————————————————————————————————————————————————————————————————————*/
async function slideLeft() {
	let prevClass = 'prev-page';
	let curClass = 'current-page';
	let nextClass = 'next-page';

	let prev_page = document.getElementsByClassName(prevClass)[0];
	let cur_page = document.getElementsByClassName(curClass)[0];
	let next_page = document.getElementsByClassName(nextClass)[0];

	// add class with sliding properties (including translateX(-100%))
	cur_page.classList.add(slideLClass);
	prev_page.classList.add(slideLClass);

	await sleep(500); // same time as transition duration

	// remove class with movement properties
	prev_page.classList.remove(slideLClass);
	cur_page.classList.remove(slideLClass);

	// move prev to next (change to also automatically repopulate with next page content)
	next_page.parentNode.insertBefore(next_page, prev_page.parentNode.childNodes[0]);

	// update current page index
	current_page = getNextPageIdx(PREV);
	// automatically repopulate with next page content
	populateNode(next_page, getNextPageIdx(PREV));

	// adjust class markers for prev, cur, and next
	// prev to next
	prev_page.classList.remove(prevClass);
	prev_page.classList.add(curClass);
	// cur to prev
	cur_page.classList.remove(curClass);	
	cur_page.classList.add(nextClass);
	// next to cur
	next_page.classList.remove(nextClass);
	next_page.classList.add(prevClass);
}

function initPages() {
	let prev = document.getElementsByClassName("prev-page")[0];
	let cur = document.getElementsByClassName("current-page")[0];
	let next = document.getElementsByClassName("next-page")[0];
	populateNode(prev, getNextPageIdx(-1));
	populateNode(cur, current_page);
	populateNode(next, getNextPageIdx(1));
}

var current_page = 0; // initialize starting page idx
async function main() {

	// get data from json
	let all_data = [];
	await importData().then(data => all_data = data);
	
	// parse
	let all_arr = Object.values(all_data)[0] // unnest 
	slide_data = splitIntoSublists(all_arr, 3);

	initPages();
}
main();