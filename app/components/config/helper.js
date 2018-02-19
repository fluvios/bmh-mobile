import React, { Component } from 'react';


export function convertToSlug(words) {
    return words.replace(/ /g, "-").toLowerCase();
}

export function cleanTag(words) {
    return words.replace(/(&nbsp;|<([^>]+)>)/ig, "").replace(/&#45;/g, "-");
}

export function shortenDescription(words) {
    let word = (words.length <= 25) ? words : words.replace(/^(.{100}[^\s]*).*/, "$1").concat(" ...");
    return word;
}