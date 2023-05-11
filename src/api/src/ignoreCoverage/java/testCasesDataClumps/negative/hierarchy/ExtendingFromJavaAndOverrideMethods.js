import {MyFile} from '../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('MyClock.java', `
import java.util.Calendar;

public class MyClock extends Calendar {

	@Override
	public void setWeekDate(int weekYear, int weekOfYear, int dayOfWeek) {
		
	}

}`);

const FileB = new MyFile('MyOtherClock.java',`
import java.util.Stack;

public class MyOtherClock extends Calendar {

    @Override // When we want to take hierarchy into account, we dont want to detect Data clumps in overrided methods
	public void setWeekDate(int weekYear, int weekOfYear, int dayOfWeek) {
		
	}

}`);

export const ExtendingFromJavaAndOverrideMethods = new TestCaseBaseClassForDataClumps(
    'ExtendingFromJavaAndOverrideMethods',
    [FileA, FileB],
    [FileA.getFileExtension()],
    []
);
