angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$ionicPlatform,$http) {
  //TODO:
  // dodanie hiszpańskiego (wtedy dwa buttony)
  // feature: dodanie informacji o wyrazach (rzeczownik, przymiotnik itd.)

  $scope.translation = "";
  $scope.translate = function(){
    $ionicPlatform.ready(function() {
      var maxMatches = 1;
      var promptString = " ";
      window.plugins.speechrecognizer.startRecognize(function(result){
          $scope.toTranslate = result[0];
          $scope.translation = "";
          $http.get('http://ws.detectlanguage.com/0.2/detect?q='+result[0]+'&key=8cc6b4e004e84a75626f69baee9a6cc3').then(function(detect_result){
            //console.log(detect_result.data.data.detections[0].language);
            var det_lang = detect_result.data.data.detections[0].language;
            var lang_to_translate = (det_lang == 'en')? '/eng-pol/': '/pol-eng/'
            console.log(lang_to_translate);

            $http.get('http://deu.hablaa.com/hs/translation/'+result[0]+lang_to_translate).then(function(res){
              console.log(res);
              $scope.translation = "";
              for(var i=0; i < 5; i++){
                 $scope.translation += res.data[i].text + "\n";
              }
             
            }, function(err){
              console.log(err);
               $scope.translation = "no translate"
            })
          
          }, function(err){
            console.log(err);
          })

          
          $scope.$apply();
      }, function(errorMessage){
          console.log("Error message: " + errorMessage);
      }, maxMatches, promptString);
      
    })
  }
})