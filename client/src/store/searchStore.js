// SearchStore.js
import { makeAutoObservable } from 'mobx';

export default class SearchStore {
    constructor() {
        this._searchQuery = '';
        makeAutoObservable(this);
    }

    setSearchQuery(query) {
        this._searchQuery = query;
    }

    get searchQuery() {
        return this._searchQuery;
    }

    clearSearch() {
        this._searchQuery = '';
    }
}