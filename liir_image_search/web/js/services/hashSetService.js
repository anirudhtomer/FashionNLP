susana.factory(
	'HashSetService',
	[function(){
		function HashSet(){
			this.keys = {};
			this.length = 0;

			this.add = function(key){

				if(angular.isUndefined(this.keys[key])){
					this.length++;
				}

				this.keys[key] = key;
			};

			this.keySet = function(){
				return this.keys;
			};

			this.size = function(){
				return this.length;
			};

			this.containsKey = function(key){
				return angular.isDefined(this.keys[key]);
			};

			this.remove = function(key){
				if(this.containsKey(key)){
					delete this.keys[key];
					this.length--;
					return true;
				}
				else{
					return false;
				}
			};

			this.clear = function(){
				this.keys = {};
				this.length = 0;
			};
		}

		return {
			newHashSet: function(){
				return new HashSet();
			}
		};
	}]);