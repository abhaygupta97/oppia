// Copyright 2014 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utility service for language operations.
 */

oppia.factory('LanguageUtilService', [
  'AudioLanguageObjectFactory', 'AutogeneratedAudioLanguageObjectFactory',
  'BrowserCheckerService', 'ALL_LANGUAGE_CODES',
  'AUTOGENERATED_AUDIO_LANGUAGES', 'SUPPORTED_AUDIO_LANGUAGES',
  function(
      AudioLanguageObjectFactory, AutogeneratedAudioLanguageObjectFactory,
      BrowserCheckerService, ALL_LANGUAGE_CODES,
      AUTOGENERATED_AUDIO_LANGUAGES, SUPPORTED_AUDIO_LANGUAGES) {
    var supportedAudioLanguageList = SUPPORTED_AUDIO_LANGUAGES;
    var autogeneratedAudioLanguageList = AUTOGENERATED_AUDIO_LANGUAGES;

    var supportedAudioLanguages = {};
    var autogeneratedAudioLanguagesByExplorationLanguageCode = {};
    var autogeneratedAudioLanguagesByAutogeneratedLanguageCode = {};

    var getShortLanguageDescription = function(fullLanguageDescription) {
      ind = fullLanguageDescription.indexOf(' (');
      if (ind === -1) {
        return fullLanguageDescription;
      } else {
        return fullLanguageDescription.substring(0, ind);
      }
    };

    var languageIdsAndTexts = ALL_LANGUAGE_CODES.map(function(languageItem) {
      return {
        id: languageItem.code,
        text: getShortLanguageDescription(languageItem.description)
      };
    });

    var allAudioLanguageCodes = (
      supportedAudioLanguageList.map(function(audioLanguage) {
        return audioLanguage.id;
      }));

    supportedAudioLanguageList.forEach(function(audioLanguageDict) {
      supportedAudioLanguages[audioLanguageDict.id] =
        AudioLanguageObjectFactory.createFromDict(audioLanguageDict);
    });

    autogeneratedAudioLanguageList.forEach(
      function(autogeneratedAudioLanguageDict) {
        var autogeneratedAudioLanguage =
          AutogeneratedAudioLanguageObjectFactory.createFromDict(
            autogeneratedAudioLanguageDict);

        autogeneratedAudioLanguagesByExplorationLanguageCode[
          autogeneratedAudioLanguage.explorationLanguage] =
            autogeneratedAudioLanguage;

        autogeneratedAudioLanguagesByAutogeneratedLanguageCode[
          autogeneratedAudioLanguage.id] =
            autogeneratedAudioLanguage;
      }
    );

    var audioLanguagesCount = allAudioLanguageCodes.length;

    return {
      getLanguageIdsAndTexts: function() {
        return languageIdsAndTexts;
      },
      getAudioLanguagesCount: function() {
        return audioLanguagesCount;
      },
      getAllAudioLanguageCodes: function() {
        return allAudioLanguageCodes;
      },
      getAudioLanguageDescription: function(audioLanguageCode) {
        return supportedAudioLanguages[audioLanguageCode].description;
      },
      // Given a list of audio language codes, returns the complement list, i.e.
      // the list of audio language codes not in the input list.
      getComplementAudioLanguageCodes: function(audioLanguageCodes) {
        return allAudioLanguageCodes.filter(function(languageCode) {
          return audioLanguageCodes.indexOf(languageCode) === -1;
        });
      },
      getLanguageCodesRelatedToAudioLanguageCode: function(audioLanguageCode) {
        return supportedAudioLanguages[audioLanguageCode].relatedLanguages;
      },
      supportsAutogeneratedAudio: function(explorationLanguageCode) {
        return (
          BrowserCheckerService.supportsSpeechSynthesis() &&
          autogeneratedAudioLanguagesByExplorationLanguageCode
            .hasOwnProperty(explorationLanguageCode));
      },
      isAutogeneratedAudioLanguage: function(audioLanguageCode) {
        return autogeneratedAudioLanguagesByAutogeneratedLanguageCode
          .hasOwnProperty(audioLanguageCode);
      },
      getAutogeneratedAudioLanguage: function(explorationLanguageCode) {
        return autogeneratedAudioLanguagesByExplorationLanguageCode[
          explorationLanguageCode];
      }
    };
  }
]);
