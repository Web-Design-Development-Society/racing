import { isDevelopment } from '../utils/index.js';
import { SIGNUP_URL } from '../constants.js';

const hrefExt = isDevelopment() ? '.html' : '';

const navLinks = [
	{ href: isDevelopment() ? 'index.html' : '/', text: 'Home' },
	{ href: 'about' + hrefExt, text: 'About' },
	{ href: 'events' + hrefExt, text: 'Events' },
	{ href: 'gallery' + hrefExt, text: 'Gallery' },
	{ href: 'faq' + hrefExt, text: 'FAQ' },
	{
		href: SIGNUP_URL,
		text: 'Sign Up',
		isExternal: true,
	},
	{
		href: 'https://runsignup.com/Race/Volunteer/ID/Rexburg/UndergradSpring2026',
		text: 'Volunteer',
		isExternal: true,
	},
	// {
	// 	// Might not need
	// 	href: 'https://runsignup.com/Race/Donate/ID/Rexburg/RexysChristmasBash',
	// 	text: 'Donate',
	// 	isExternal: true,
	// },
];

/** Constructs an `a` nav element piece by piece */
function navLink({ href, text, isExternal }) {
	let link = `<a href="${href}"`;
	if (isExternal) link += ' target="_blank"';
	link += `>${text}`;
	if (isExternal) link += '  <i class="fa-solid fa-up-right-from-square fa-xs"></i>';
	link += '</a>';
	return link;
}

function header() {
	// hardcoded the homepage to the logo link, so it has to be updated her if the link changes.
	return `
	<a href="${navLinks[0].href}"><img src="images/logo.png" alt="Great Western Racing Logo"/></a>
	<div>
    <nav id="nav">
      ${navLinks.map((link) => navLink(link)).join('')}
    </nav>
		<i id="hamburger" class="hamburger fa-solid fa-bars fa-2x"></i>
	</div>
  `;
}

function toggleMenu() {
	const hamburger = document.getElementById('hamburger');
	const nav = document.getElementById('nav');
	hamburger.addEventListener('click', function () {
		nav.classList.toggle('show');

		// update accessibility state
		const isOpen = !nav.classList.contains('show');
		hamburger.setAttribute('aria-expanded', isOpen);
	});
}

export function insertHeader() {
	const headerElement = header();
	document.querySelector('header').insertAdjacentHTML('beforeend', headerElement);

	toggleMenu();
}
