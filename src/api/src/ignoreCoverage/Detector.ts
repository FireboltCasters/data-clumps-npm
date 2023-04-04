export class DetectorOptions {
    public sharedDataFieldsMinimum: number = 3;
    public sharedDataFieldsHierarchyConsidered: boolean = false;
    public sharedMethodParametersMinimum: number = 3;
    public sharedMethodParametersHierarchyConsidered: boolean = false;

    public constructor(options: any){
        let keys = Object.keys(options || {});
        for (let key of keys) {
            // check if this key exists in this class
            if (this.hasOwnProperty(key)) {
                this[key] = options[key]; // set the value
            }
        }
    }
}

export class Detector {

    public options: DetectorOptions;

    public constructor(options: any){
        this.options = new DetectorOptions(options);
    }

}
