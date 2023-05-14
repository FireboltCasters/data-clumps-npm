import {MyFile} from '../../../../../ParsedAstTypes';
import {TestCaseBaseClassForDataClumps} from "../../../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('MyCalendar.java', `
import org.unknown.Calendar;

/**
 * The annotation for @Override is not given. 
 * Since we dont know the Calendar class, we cant detect if the method is inherited
 */
public class MyCalendar extends Calendar {

	public void setWeekDate(int weekYear, int weekOfYear, int dayOfWeek) {
		
	}

}`);

const FileB = new MyFile('MyOtherCalendar.java',`

/**
 * Note we dont extend Calendar
 * We might analyse this method, but we wont find any other matching method, since MyCalendar is
 * extending an unknown class, where we don't know if the method is inherited
 */
public class MyOtherCalendar {

	public void setWeekDate(int weekYear, int weekOfYear, int dayOfWeek) {
		
	}
}
`);

export const ExtendingFromJavaAndOverrideMethods = new TestCaseBaseClassForDataClumps(
    'ExtendingFromJavaAndOverrideMethods',
    [FileA, FileB],
    [FileA.getFileExtension()],
    []
);
