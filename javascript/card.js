(function () {
    'use strict';

    let winningCombos = [
        {"combo" : [0,1,2,3,4]},
        {"combo" : [5,6,7,8,9]},
        {"combo" : [10,11,12,13,14]},
        {"combo" : [15,16,17,18,19]},
        {"combo" : [20,21,22,23,24]},

        {"combo" : [0,5,10,15,20]},
        {"combo" : [1,6,11,16,21]},
        {"combo" : [2,7,12,17,22]},
        {"combo" : [3,8,13,18,23]},
        {"combo" : [4,9,14,19,24]},

        {"combo" : [0,6,12,18,24]},
        {"combo" : [4,8,12,16,20]},
        {"combo" : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]}
    ];

    let card = new Vue({
        el : '#app',
        data: {
            allSquares: [],
            cardSquares: [],
        },
        methods: {
            shuffle(array,amount) {
                console.log('Shuffle');
                var i = array.length,
                    tempValue,
                    randIndex;

                while (i > 0){
                    randIndex = Math.floor(Math.random() * i);
                    i -= 1;
                    tempValue          = array[i];
                    array[i]         = array[randIndex];
                    array[randIndex] = tempValue;
                }
                return array.slice(0,amount);
            },
            getNewCard(type) {
                console.log('getNewCard', type);
                this.items = this.shuffle(this.allItems,25);
                console.log(this.items.length);
                let squaresString = JSON.stringify(this.items);
                console.log(squaresString.length);
                localStorage.setItem('currentCard', squaresString);
                console.log(this.inLocalStorage);
            },
            isInWinningCombo(){
                return 'Called: isInWinningCombo';
            },
            isInArray(){
                console.log('Called: isInArray');
                //return (arr.indexOf(obj) >= 0);
            },



            //CHECK TO SEE IF IN LOCAL STORAGE
            isInLocalStorage() {
                console.log('Called: isInLocalStorage');
                if (localStorage.getItem('currentCard')) {
                    return true;
                }
            },
            getSquaresFromAPI(){
                console.log('STEP 1.1: GETTING SQUARES FROM API');
                //GET CARD AND CONVERT TO JSON

                axios.get('data/bingoSquares.json')
                        .then(
                            response => {
                                this.allSquares = response.data;
                                console.log('STEP 1.2: GOT ' + this.allSquares.length+ ' SQUARES FROM API');

                                this.createCard();
                            })
                        .catch(
                            e => {
                                console.log(e);
                                //this.errors.push(e);
                        })

            },
            createCard(){
                console.log('STEP 2. CREATE CARD AND STORE');
                this.cardSquares = this.shuffle(this.allSquares,25);
                localStorage.setItem('currentCard', JSON.stringify(this.cardSquares))
            },
            getCardFromLocalStorage(){
                console.log('STEP 1.1: GETTING CARD & SELECTED SQUARES FROM LOCAL STORAGE');
                //GET CARD AND CONVERT TO JSON
                this.cardSquares = JSON.parse(localStorage.getItem('currentCard'))
            },
            getSelectedSquaresFromLocalStorage(){
                console.log('STEP 1.2: GETTING SELECTED SQUARES FROM LOCAL STORAGE');
                //GET CARD AND CONVERT TO JSON
                this.cardSquares = JSON.parse(localStorage.getItem('currentCard'))
            },
            
            squareSelected(square,index){
                console.log('SQUARE ' + index + ' SELECTED');
                console.log(square.name);
            }
        },
        computed: {},
        watch: {},

        mounted() {
            if(this.isInLocalStorage()){
                console.log('STEP 1: GET CARD & SELECTED SQUARES FROM LOCAL STORAGE');
                this.getCardFromLocalStorage();
            }else{
                console.log('STEP 1: GET SQUARES FROM API');
                this.getSquaresFromAPI();
            }

            //console.log('Mounted');
            //if(!this.isInLocalStorage()) {
            //    axios.get('data/bingoSquares.json')
            //        .then(response => {
            //            this.allItems = response.data;
            //            this.getNewCard('new');
            //        })
            //        .catch(e => {
            //            console.log(e);
            //            //this.errors.push(e);
            //        })
            //}else{
            //    this.allItems = JSON.parse(localStorage.getItem('currentCard'));
            //}
            //console.log();
        }
    });



}());