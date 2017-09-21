(function () {
    'use strict';

    let card = new Vue({
        el : '#app',
        data: {
            errors: [],
            allSquares: [],
            cardSquares: [],
            selectedSquares: [],
            selectedSquareIndexes: [],
            winningCombos: [
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
                {"combo" : [4,8,12,16,20]}
            ],
            alreadyWinner: false,
            alreadySingleWinner: false,
            alreadyDoubleWinner: false,
            alreadyTripleWinner: false,
            alreadyBlackoutWinner: false,
            winningRowCol: []
        },
        methods: {
            shuffle(array,amount) {
                //console.log('Shuffle');
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
            isInWinningCombo(){
                return 'Called: isInWinningCombo';
            },
            isInArray(arr,obj){
                //console.log('Called: isInArray');
                return (arr.indexOf(obj) >= 0);
            },
            sortNumbers(a,b){
                return a - b;
            },
            isInLocalStorage() {
                //console.log('Called: isInLocalStorage');
                if (localStorage.getItem('currentCard')) {
                    return true;
                }
            },
            getSquaresFromAPI(){
                //console.log('STEP 1.1: GETTING SQUARES FROM API');
                //GET CARD AND CONVERT TO JSON
                this.clearAll();
                axios.get('data/bingoSquares.json')
                        .then(
                            response => {
                                this.allSquares = response.data;
                                //console.log('STEP 1.2: GOT ' + this.allSquares.length+ ' SQUARES FROM API');

                                this.createCard();
                            })
                        .catch(
                            e => {
                                console.log(e);
                                this.errors.push(e);
                        })

            },
            createCard(){
                //console.log('STEP 2. CREATE CARD AND STORE');
                this.cardSquares = this.shuffle(this.allSquares,25);
                localStorage.setItem('currentCard', JSON.stringify(this.cardSquares))
            },
            getCardFromLocalStorage(){
                //console.log('STEP 1.1: GETTING CARD & SELECTED SQUARES FROM LOCAL STORAGE');
                //GET CARD AND CONVERT TO JSON
                this.cardSquares     = JSON.parse(localStorage.getItem('currentCard'));

                if (localStorage.getItem('selectedSquares')) {
                    this.selectedSquares = JSON.parse(localStorage.getItem('selectedSquares'));
                    this.selectedSquareIndexes = JSON.parse(localStorage.getItem('selectedSquareIndexes'));
                    this.alreadyWinner         = localStorage.getItem('alreadyWinner');
                    this.alreadySingleWinner   = localStorage.getItem('alreadySingleWinner');
                    this.alreadyDoubleWinner   = localStorage.getItem('alreadyDoubleWinner');
                    this.alreadyTripleWinner   = localStorage.getItem('alreadyTripleWinner');
                    this.alreadyBlackoutWinner = localStorage.getItem('alreadyBlackoutWinner');
                }

            },
            squareSelected(square,id,index){
                if (!this.isInArray(this.selectedSquares,id)) {
                    //ADD SELECTED SQUARE ID
                    this.selectedSquares.push(id);
                }else{
                    //REMOVE SELECTED SQUARE ID
                    let squareID = this.selectedSquares.indexOf(id);
                    if (squareID >= 0) {
                        this.selectedSquares.splice(squareID, 1 );
                    }
                }

                if (!this.isInArray(this.selectedSquareIndexes,index)) {
                    //ADD SELECTED SQUARE INDEX
                    this.selectedSquareIndexes.push(index);
                }else{
                    //REMOVE SELECTED SQUARE INDEX
                    let squareIndex = this.selectedSquareIndexes.indexOf(index);
                    if (squareIndex >= 0) {
                        this.selectedSquareIndexes.splice(squareIndex, 1 );
                    }
                }
                //STORE IN LOCAL STORAGE
                localStorage.setItem('selectedSquares', JSON.stringify(this.selectedSquares));
                localStorage.setItem('selectedSquareIndexes', JSON.stringify(this.selectedSquareIndexes.sort(this.sortNumbers)));

                if (this.selectedSquareIndexes.length >= 5) {
                    this.isThereAWinner(this.selectedSquareIndexes);
                }
                if(this.selectedSquareIndexes.length === 25) {
                    alert('Blackout Winner');
                    this.alreadyBlackoutWinner = true;
                }

                //CALL TO SEE IF THERE IS A WINNING COMBO IF 5 OR MORE SELECTED
                if (!this.alreadyWinner) {
                    if(this.winningRowCol.length > 0 && (!this.alreadySingleWinner || !this.alreadyDoubleWinner || !this.alreadyTripleWinner)){
                        if(this.winningRowCol.length === 1){
                            alert('Single Winner');
                            this.alreadyWinner = true;
                            this.alreadySingleWinner = true;
                            localStorage.setItem('alreadyWinner', true);
                            localStorage.setItem('alreadySingleWinner', true);
                        }else if(this.winningRowCol.length === 2){
                            alert('Double Winner');
                            this.alreadyWinner = true;
                            this.alreadyDoubleWinner = true;
                            localStorage.setItem('alreadyWinner', true);
                            localStorage.setItem('alreadyDoubleWinner', true);
                        }else if(this.winningRowCol.length === 3){
                            alert('Triple Winner');
                            this.alreadyWinner = true;
                            this.alreadyTripleWinner = true;
                            localStorage.setItem('alreadyWinner', true);
                            localStorage.setItem('alreadyTripleWinner', true);
                        }
                    }
                }



            },

            //WHEN SELECTED IS THERE A WINNER (SINGLE, DOUBLE, AND TRIPLE BINGO)
            //IS THERE A BLACKOUT WINNER (ALL SQUARES SELECTED)
            isThereAWinner(selected) {
                //console.log('CALLED: isThereAWinner(selected)');
                //console.log(selected);
                let counter = 0;

                if (selected.length !== 25) {
                    this.winningCombos.map(function (combos, index) {
                        if(selected.length >= 5){
                            selected.map(function (selected, sindex) {
                                if(combos.combo.indexOf(selected) >= 0){
                                    counter++;
                                }
                            });
                        }

                        if(counter === 5){
                            card.winningRowCol.push(combos.combo);
                        }
                        counter = 0;
                    });

                }
            },

            clearAll(){
                //console.log('Clear All');
                this.allSquares            = [];
                this.cardSquares           = [];
                this.selectedSquares       = [];
                this.selectedSquareIndexes = [];
                this.winningRowCol         = [];
                this.alreadyWinner         = false;
                this.alreadySingleWinner   = false;
                this.alreadyDoubleWinner   = false;
                this.alreadyTripleWinner   = false;
                this.alreadyBlackoutWinner = false;
                localStorage.removeItem('currentCard');
                localStorage.removeItem('selectedSquares');
                localStorage.removeItem('selectedSquareIndexes');
                localStorage.removeItem('alreadyWinner');
                localStorage.removeItem('alreadySingleWinner');
                localStorage.removeItem('alreadyDoubleWinner');
                localStorage.removeItem('alreadyTripleWinner');
                localStorage.removeItem('alreadyBlackoutWinner');
            }
        },
        computed: {},
        watch: {},

        mounted() {
            if(this.isInLocalStorage()){
                //console.log('STEP 1: GET CARD & SELECTED SQUARES FROM LOCAL STORAGE');
                this.getCardFromLocalStorage();
            }else{
                //console.log('STEP 1: GET SQUARES FROM API');
                this.getSquaresFromAPI();
            }
        }
    });

}());