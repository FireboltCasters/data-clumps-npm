// @ts-nocheck
import React from "react";

export class SynchedVariableInterface {
    public key: string;
	public defaultValue: string;
	public beforeHook: any;
	public afterHook: any;

	constructor(key: string, defaultValue?: string, beforeHook?: any, afterHook?: any) {
		this.key = key;
		this.defaultValue = defaultValue;
		this.beforeHook = beforeHook;
		this.afterHook = afterHook;
	}

}