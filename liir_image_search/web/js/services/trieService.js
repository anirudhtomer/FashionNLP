susana.factory(
	'TrieService',
	['HashMapService', function(HashMapService){

		function TrieNode(){
			var children = {};
			var leaves = new HashMapService.newValuesHashMap();

			return{
				"getChildren": function(){
					return children;
				},
				"getLeaves": function(){
					return leaves;
				},
				"addWord": this.addToTrie,
				"search": this.filterLeaves
			};
		}

		TrieNode.prototype.addToTrie = function(contentStr, dataIndex, curLevel, stopLevel){
			if(angular.isUndefined(curLevel)){
				curLevel = 0;
			}

			if(angular.isUndefined(stopLevel)){
				stopLevel = contentStr.length;
			}

			this.getLeaves().put(dataIndex, dataIndex); //just a marker to tell it exists

			if(curLevel === stopLevel){
				return;
			}

			var letter = contentStr.charAt(curLevel).toLowerCase();

			var trieNode = this.getChildren()[letter];
			if(trieNode === undefined){
				this.getChildren()[letter] = trieNode = new TrieNode();
			}

			trieNode.addWord(contentStr, dataIndex, curLevel + 1, stopLevel);
		};

		TrieNode.prototype.filterLeaves = function(searchStr){
			if(angular.isUndefined(searchStr)){
				searchStr = '';
			}else{
				searchStr = searchStr.toLowerCase();
			}

			var words = searchStr.split(" ");

			var wordLeavesArr = [];
			var min = 100000000;

			for(var i = 0; i < words.length; i++){
				var word = words[i];

				if(word.length > 0){
					var trieNode = this;

					for(var j = 0; j < word.length; j++){
						trieNode = trieNode.getChildren()[word.charAt(j)];
						if(trieNode === undefined){
							break;
						}
					}

					if(trieNode !== undefined){
						var leaveList = trieNode.getLeaves();
						if(leaveList.length < min){
							min = leaveList.length;
							wordLeavesArr.unshift(leaveList);
						}
						else{
							wordLeavesArr.push(leaveList);
						}
					}else{
						wordLeavesArr = [];
						break;
					}
				}
			}

			if(searchStr.length === 0){
				return this.getLeaves();
			}
			else if(wordLeavesArr.length === 1){
				return wordLeavesArr[0];
			}
			else{
				return intersectLeavesArr(wordLeavesArr);
			}
		};

		function intersectLeavesArr(wordLeavesArr){
			var intersectionHashMap = new HashMapService.newValuesHashMap();

			if(wordLeavesArr.length > 0){
				var minWordLeaves = wordLeavesArr[0];

				for(key in minWordLeaves.keySet()){
					var presentInAll = true;

					for(var i = 1; i < wordLeavesArr.length; i++){
						if(wordLeavesArr[i].containsKey(key) === false){
							presentInAll = false;
							break;
						}
					}

					if(presentInAll === true){
						intersectionHashMap.put(key, key);
					}
				}
			}

			return intersectionHashMap;
		};

		return {
			createNewTrie: function(){
				return new TrieNode();
			}
		};
	}
]);