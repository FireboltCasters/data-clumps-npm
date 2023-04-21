import {action, createStore, useStoreActions, useStoreState} from "easy-peasy";
import {KeyExtractorHelper} from "./KeyExtractorHelper";
import {SynchedStates} from "./SynchedStates";
import {SynchedVariableInterface} from "./SynchedVariableInterface";

export function useSynchedState(storageKey): [value: string, setValue: (value) => {}] {
    const value = useStoreState((state) => {
      return state[storageKey]?.value
    });
    const setValue = useStoreActions((actions) => actions[storageKey].setValue);
    return [
        value,
        setValue
    ]
}

export function useSynchedJSONState(storageKey): [value: any, setValue: (value) => {}] {
  const [jsonStateAsString, setJsonStateAsString] = useSynchedState(storageKey);
  const parsedJSON = JSON.parse(jsonStateAsString || "null");
  const setValue = (dict) => setJsonStateAsString(JSON.stringify(dict))
  return [
    parsedJSON,
    setValue
  ]
}

export class SynchedStateHelper {

    private static store;
    private static globalSynchedStoreModels: {[key: string] : any} = {};

    static getContextStore(){
        return SynchedStateHelper.store;
    }

    static getRequiredStorageKeys(){
        return KeyExtractorHelper.getListOfStaticKeyValues(SynchedStates);
    }

    private static registerSynchedState(key: string, defaultValue?: string, beforeHook?, afterHook?, override: boolean = false){
        let additionalModel = SynchedStateHelper.globalSynchedStoreModels[key];
        if(!!additionalModel && !override){
            return new Error("Additional variable for storage already exists for that key: "+key);
        }
        SynchedStateHelper.globalSynchedStoreModels[key] = new SynchedVariableInterface(key, defaultValue, beforeHook, afterHook);
    }

    static registerSynchedStates(listOfKeys: string[] | string, defaultValue?: string, beforeHook?, afterHook?, override: boolean = false){
        if (typeof listOfKeys === 'string'){
            listOfKeys = [listOfKeys];
        }

        for(let i=0; i<listOfKeys.length; i++){
            let key = listOfKeys[i];
            SynchedStateHelper.registerSynchedState(key, defaultValue, beforeHook, afterHook, override);
        }
    }

    private static handleAction(storageKey, state, payload, aditionalStoreModel: SynchedVariableInterface){
        let beforeHook = aditionalStoreModel.beforeHook;
        let afterHook = aditionalStoreModel.afterHook;
        let cancel = false;
        if(!!beforeHook){
            cancel = !beforeHook(storageKey, state, payload);
        }
        if(!cancel){
            state.value = payload;
            if(!!afterHook){
                afterHook(storageKey, state, payload);
            }
        }
    }

    static initSynchedKeys(){
        SynchedStateHelper.registerSynchedStates(SynchedStateHelper.getRequiredStorageKeys())
    }

    static initContextStores(){
        let model = {};

        let additionalKeys = Object.keys(SynchedStateHelper.globalSynchedStoreModels);

        for(let i=0; i<additionalKeys.length; i++){
            let key = additionalKeys[i];
            let aditionalStoreModel: SynchedVariableInterface = SynchedStateHelper.globalSynchedStoreModels[key];
            let storageKey = aditionalStoreModel.key;
            model[storageKey] = {
                value: aditionalStoreModel.defaultValue,
                setValue: action((state, payload) => {
                    SynchedStateHelper.handleAction(storageKey, state, payload, aditionalStoreModel);
                })
            }
        }

        const store = createStore(
            model
        );

        SynchedStateHelper.store = store;
    }

}
