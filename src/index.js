// Import the Ipbase module
import Ipbase from '@everapi/ipbase-js';
import moment from 'moment';

const quotesDiv = document.getElementById('quotes');
const timeDiv = document.getElementById('time');
const timezoneDiv = document.getElementById('timezone');
const switchMoreLessButton = document.getElementById('switch-more-less');
const switchButtonTextDiv = document.getElementsByClassName('switch-button-text')[0];
const containerDiv = document.getElementsByClassName('content-container')[0];
const switchIconOnButton = document.getElementById('switch-button-icon');
const newQuoteButton = document.getElementById('new-quote-button');

const quotationParagragh = document.getElementById('random-quote');
const authorName = document.getElementById('quote-author');
const countryCityName = document.getElementsByClassName('city-country')[0];
const timeTag = document.getElementById('location-time');
const timeZoneTag = document.getElementById('location-timezone');
const dayOfYearTag = document.getElementById('day-of-year');
const dayOfWeekTag = document.getElementById('day-of-week');
const weekNumberTag = document.getElementById('week-number');
const theTimezoneTag = document.getElementById('the-timezone');
const hourOfDayTag = document.getElementById('when');
const nightOrDayImage = document.getElementById('sun-moon-icon-image');

let locationLatitude;
let locationLongitude; 
let cityName = '';
let countryName;
let quoteText = '';
let quoteAuthor = '';

let backgroundImage = '/bg-image-daytime.jpg'; // Default background image

// Set the icon based on the text content of the button
switchButtonTextDiv.textContent === 'MORE' ? switchIconOnButton.src = "/icon-arrow-down.svg" : switchIconOnButton.src = "/icon-arrow-up.svg";
if (switchButtonTextDiv.textContent === 'LESS') {
    switchIconOnButton.classList.remove('p-3');
} else {
    switchIconOnButton.classList.add('p-3');
}

newQuoteButton.addEventListener('click', async () => {
    await fetchProgrammingQuote();
});

switchMoreLessButton.addEventListener('click', () => {
    if (switchButtonTextDiv.textContent === 'MORE') {
        switchButtonTextDiv.textContent = 'LESS';
        timezoneDiv.classList.add('bg-gray-200');
        timezoneDiv.classList.remove('hidden');
        quotesDiv.classList.toggle('hidden');
        switchIconOnButton.src = "/icon-arrow-up.svg";
        switchIconOnButton.classList.remove('p-3');
    } else {
        switchButtonTextDiv.textContent = 'MORE';
        timezoneDiv.classList.add('hidden');
        quotesDiv.classList.remove('hidden');
        switchIconOnButton.src = "/icon-arrow-down.svg";
        switchIconOnButton.classList.add('p-3');
    }
});

const ipBase = new Ipbase('ipb_live_wS1CHL237wD6UYqQjIOQC5XPc2uUahnWe4OrgXXs');
async function fetchInfoFromIp() {
    ipBase.info().then(async response => {
        cityName = response.data.location?.city?.name || 'Unknown City';
        locationLatitude = response.data?.location?.latitude;
        countryName = response.data?.location?.country?.name;
        locationLongitude = response.data?.location?.longitude;
        countryCityName.innerHTML = `${cityName.toUpperCase()}, ${countryName.toUpperCase()}`;
        await fetchProgrammingQuote();
        await fetchTimeZone();
    }).catch(error => console.error('Error fetching location and time zone details:', error));
}

async function fetchTimeZone() {
    const apiUrl = `https://api.api-ninjas.com/v1/worldtime?lat=${locationLatitude}&lon=${locationLongitude}`;
    fetch(apiUrl, {
        headers: {
            'X-Api-Key': 'SgrUj9SB7wDyv8T9iKzUeA==FvmLHf6A1Q58BaGb',
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const { timezone, datetime, hour } = data;
        timeTag.innerText = datetime.toString().slice(11, 16);
        timeZoneTag.innerText = timezone;
        const date = moment(data.date);
        dayOfYearTag.innerText = date.dayOfYear();
        dayOfWeekTag.innerText = moment(data.date).isoWeekday();
        weekNumberTag.innerText = date.isoWeek();
        theTimezoneTag.innerText = timezone;

        if (hour < 12 && hour >= 5) {
            hourOfDayTag.innerText = `GOOD MORNING, IT'S CURRENTLY`;
            nightOrDayImage.src = '/icon-sun.svg';
            backgroundImage = '/bg-image-daytime.jpg';
        } else if (hour < 18 && hour >= 12) {
            hourOfDayTag.innerText = `GOOD AFTERNOON, IT'S CURRENTLY`;
            nightOrDayImage.src = '/icon-sun.svg';
            backgroundImage = '/bg-image-daytime.jpg';
        } else {
            hourOfDayTag.innerText = 'GOOD EVENING, IT\'S CURRENTLY';
            nightOrDayImage.src = '/icon-moon.svg';
            backgroundImage = '/bg-image-nighttime.jpg';
        }

        updateBackgroundImage();
    })
    .catch(error => console.error('Error fetching time info:', error));
}

// Function to fetch a random programming quote
async function fetchProgrammingQuote() {
    fetch('https://quotes-api-self.vercel.app/quote')
    .then(response => response.json())    
    .then(quote => {
        quoteText = quote.quote;
        quoteAuthor = quote.author;
        quotationParagragh.innerHTML = quoteText;
        authorName.innerHTML = quoteAuthor;
    })
    .catch(error => console.error('Error fetching quote:', error));
}

// Function to update the background image based on screen size and time
function updateBackgroundImage() {
    containerDiv.className = 'content-container'; // Reset classes

    if (window.matchMedia('(max-width: 640px)').matches) {
        containerDiv.classList.add(backgroundImage.includes('daytime') 
            ? "bg-[url('/mobile/bg-image-daytime.jpg')]" 
            : "bg-[url('/mobile/bg-image-nighttime.jpg')]");
    } else if (window.matchMedia('(max-width: 1000px)').matches) {
        containerDiv.classList.add(backgroundImage.includes('daytime') 
            ? "bg-[url('/tablet/bg-image-daytime.jpg')]" 
            : "bg-[url('/tablet/bg-image-nighttime.jpg')]");
    } else {
        containerDiv.classList.add(backgroundImage.includes('daytime') 
            ? "bg-[url('/bg-image-daytime.jpg')]" 
            : "bg-[url('/bg-image-nighttime.jpg')]");
    }

    containerDiv.classList.add('bg-cover', 'bg-center', 'bg-no-repeat', 'bg-black/50', 'bg-blend-overlay');
}

window.addEventListener('resize', updateBackgroundImage);

// await fetchInfoFromIp();
fetchInfoFromIp();
updateBackgroundImage();
