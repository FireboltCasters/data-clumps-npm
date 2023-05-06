export interface RefactoringInterface {

    /**
     * https://refactoring.guru/smells/data-clumps
     */

    // If repeating data comprises the fields of a class, use Extract Class to move the fields to their own class.
        // if a class has serialVersionUID, the extract class should also have serialVersionUID
    extractClass();

    // If the same data clumps are passed in the parameters of methods, use Introduce Parameter Object to set them off as a class.
    introduceParameterObject();

    // If some of the data is passed to other methods, think about passing the entire data object to the method instead of just individual fields. Preserve Whole Object will help with this.
    preserveWholeObject();

}
