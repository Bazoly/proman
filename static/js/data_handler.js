// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_delete: function (url, callback) {
        fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(json_response => callback(json_response));
    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (board_id, callback) {
        this._api_get('/get-statuses/' + board_id, (response) => {
            this._data['statuses'] = response
            callback(response)
        });

        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (column_id, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get('/get-cards/' + column_id, (response) => {
            this._data['cards'] = response
            callback(response)
        });
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        let data = {boardTitle: boardTitle};
        this._api_post("/create-boards", data, (response) => {
            callback(response)
        })
    },
    createNewCard: function (board_id, cardTitle, callback) {
        let data = {
            "board_id": board_id,
            "title": cardTitle
        };
        this._api_post("/create-card", data, (response) => {
            callback(response)
        })
        // creates new card, saves it and calls the callback function with its data
    },
    createNewColumn: function (board_id, columnTitle, callback) {
        let data = {
            "board_id": board_id,
            "title": columnTitle
        };
        this._api_post("/create-column", data, (response) => {
            callback(response)
        })
        // creates new column, saves it and calls the callback function with its data
    },

    deleteBoard: function (boardId, callback) {
        this._api_delete(`/board/${boardId}`, (response) => {
            callback(response)
        })
    },
    deleteCard: function (cardId, callback) {
        this._api_delete(`/card/${cardId}`, (response) => {
            callback(response)
        })
    },
    deleteColumn: function (columnId, callback) {
        this._api_delete(`/column/${columnId}`, (response) => {
            callback(response)
        })
    },

    changeCardStatus: function (cardId, boardId, columnId, orders, cardsId, callback) {
        let data = {
            boardId: boardId,
            columnId: columnId,
            orders: orders,
            cardsId: cardsId,
        }
        this._api_post(`/card/${cardId}/position`, data, (response) => {
            callback(response)
        })
    },
    // here comes more features
    renameBoard: function (board_id, data, callback) {
        this._api_post("/rename/" + board_id, data, (response) => {
            callback(response)
        });

    },
    renameStatus: function (status_id, data, callback) {
        this._api_post("/column/" + status_id, data, (response) => {
            callback(response)
        });
    },
    renameCards: function (card_id, data, callback) {
        this._api_post("/card/" + card_id, data, (response) => {
            callback(response)
        });

    }
};
