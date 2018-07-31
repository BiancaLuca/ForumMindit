(function() {

    'use strict';

    angular
        .module("minditForum")
        .controller("ProfilePageController", Controller);

    Controller.$inject = [
        '$scope',
        '$rootScope',
        '$state',
        'ProfilePageService',
        'SharedService'
    ];

    function Controller($scope,
                        $rootScope,
                        $state,
                        ProfilePageService,
                        SharedService) {

        var vm = this;

        function init(){
            vm.editMode = false;
            var un = localStorage.getItem("username");
            var display = localStorage.getItem("display");

            if(un !=null && display !=null && $rootScope.usr==null){
                $rootScope.dsp = display;
                $rootScope.usr = un;
            } else {

            }
        }
        init();

        window.onbeforeunload = function (ev) {
            localStorage.setItem("username", $rootScope.usr);
            localStorage.setItem("display", $rootScope.dsp);
        }

        vm.search = function(){
            vm.result = "";
            ProfilePageService.search(vm.input)
                .then(function (response) {
                    vm.result = response.data;
                    vm.questions = "";
                    vm.myquestions = "";
                    vm.myAnsQuests = "";

                })

        }

        vm.addQuest = function(){

            var question ={
                userName: $rootScope.usr,
                questText: vm.quest
            }

            SharedService.addQuest(question)
                .then(function (response) {
                    vm.quest = "";

                }, function (reason) {
                    alert("Error");
                });
        }

        vm.addAns = function(){

            var answer = {
                qId : vm.selectedQuest.questId,
                userName: $rootScope.usr,
                ansText: vm.ans
            }

            SharedService.addAns(answer)
                .then(function(response){
                    vm.ans = "";
                }, function (reason) {
                    alert("Error");
                })
        }

        vm.showAll = function(){
            ProfilePageService.find()
                .then(function (response) {
                    vm.questions = response.data;
                    vm.myquestions = "";
                    vm.shw = false;
                    vm.myAnsQuests = "";
                    vm.result = "";
                    vm.show = true;
                })
        }

        vm.deleteQuestion = function(){
            var question = vm.selectedQuest;
            ProfilePageService.deleteQuestion(question)
                .then(function (response) {
                    alert("Delete");
                }, function (reason) {
                    alert("Error");
                });
        }

        vm.deleteAnswer = function(){
            var answer = vm.selectedAnswer;
            ProfilePageService.deleteAnswer(answer)
                .then(function (response) {
                    alert("Delete");
                }, function (reason) {
                    alert("Error");
                });
        }


        vm.modal = function(quest){
            vm.selectedQuest = quest;
            ProfilePageService.answer(vm.selectedQuest.questId)
                .then(function (response) {
                    vm.answers = response.data;
                })
        }

        vm.modal2 = function(answer){
            vm.selectedAnswer = answer;
        }


        $(document).ready(function(){

            $("#myModal1").on('hide.bs.modal', function () {

                vm.answers = "";

            });
        });

        vm.myQuest = function(){
             ProfilePageService.myquest($rootScope.usr)
                 .then(function (response) {
                     vm.myquestions = response.data;
                     vm.questions = "";
                     vm.shw = true;
                     vm.myAnsQuests = "";
                     vm.result = "";
                     vm.show = false;
                 })
        }

        vm.enableEditMode = function(){

            vm.editMode = true;
            alert(vm.editMode);
        }

        vm.update = function () {

            ProfilePageService.updateQuestion(vm.selectedQuest)
                .then(function (response) {
                    vm.editMode = false;
                });

        }

        vm.updateAnswer = function () {

            ProfilePageService.updateAnswer(vm.selectedAnswer)
                .then(function (response) {
                    vm.editMode = false;
                });

        }

        vm.myAnsQuest = function(){
            ProfilePageService.myAnsQuest($rootScope.usr)
                .then(function(response){
                    vm.myAnsQuests = response.data;
                    vm.myquestions = "";
                    vm.questions = "";
                    vm.result = "";
                    vm.show = false;
                }, function (reason) {
                    vm.myquestions = "";
                    vm.questions = "";
                    vm.show = false;
                })
        }

        vm.LogOut = function () {

            $rootScope.dsp = null;
            $rootScope.usr = "";
            $state.go("home", true);

        }


    }

})();