susana.factory(
	'HashMapService',
	['HashSetService',function(HashSetService){

		function ValuesHashMap(){
			this.keys = HashSetService.newHashSet();
			this.hashMap = {};
			this.length = 0;

			this.emptyIndices = [];
			this.valuesArr = [];

			this.keySet = function(){
				return this.keys.keySet();
			};

			this.size = function(){
				return this.length;
			};

			this.containsKey = function(key){
				return this.keys.containsKey(key);
			};

			this.clear = function(){
				this.emptyIndices.length = 0;
				this.valuesArr.length = 0;
				this.hashMap = {};
				this.length = 0;
				this.keys.clear();
			};

			this.put = function(key, value){
				var newIndex = undefined;
				if(this.containsKey(key)){
					newIndex = this.hashMap[key].index;
				}
				else{
					newIndex = this.emptyIndices.length == 0 ? this.length:this.emptyIndices.pop();
					this.length++;
				}
				this.keys.add(key);
				this.hashMap[key] = {
					"index": newIndex,
					"value": value
				};
				this.valuesArr[newIndex] = value;
			};

			this.getHashMap = function(){
				return this.hashMap;
			};

			this.get = function(key){
				if(this.containsKey(key)){
					return this.hashMap[key].value;
				}
				else{
					return undefined;
				}
			};

			this.remove = function(key){
				if(this.containsKey(key)){
					var retVal = this.hashMap[key];
					this.keys.remove(key);
					delete this.hashMap[key];
					this.length--;
					this.valuesArr[retVal.index] = undefined;
					this.emptyIndices.push(retVal.index);
					return retVal.value;
				}
				return null;
			};

			this.values = function(){

				while(this.emptyIndices.length > 0){
					var emptyIndex = this.emptyIndices.pop();

					while(this.valuesArr[this.valuesArr.length - 1] == undefined){
						this.valuesArr.pop();
					}

					if((this.valuesArr.length - 1) > emptyIndex){
						this.valuesArr[emptyIndex] = this.valuesArr.pop();
					}
				}

				return this.valuesArr;
			};
		}

		return {
			newValuesHashMap: function(){
				return new ValuesHashMap();
			}
		};
	}
]);