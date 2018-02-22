import React, { Component } from 'react';


export function convertToSlug(words) {
    return words.replace(/ /g, "-").toLowerCase();
}

export function cleanTag(words) {
    return words.replace(/(&nbsp;|<([^>]+)>)/ig, "").replace(/&#45;/g, "-").replace(/&#8220/g, "'").replace(/&#8221/g, "'");
}

export function shortenDescription(words) {
    let word = (words.length <= 25) ? words : words.replace(/^(.{100}[^\s]*).*/, "$1").concat(" ...");
    return word;
}

export function convertToRupiah(angka) {
	var rupiah = '';		
	var angkarev = angka.toString().split('').reverse().join('');
	for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
    rupiah = rupiah.split('',rupiah.length-1).reverse().join('');
    return 'IDR. '+(rupiah.length < 1 ? '0' : rupiah)+',-';
}

 
export function convertToAngka(rupiah) {
	return parseInt(rupiah.replace(/[^0-9]/g, ''), 10);
}