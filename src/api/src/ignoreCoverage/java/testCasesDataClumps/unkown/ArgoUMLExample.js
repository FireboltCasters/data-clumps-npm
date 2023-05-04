import {MyFile} from "../../../ParsedAstTypes";
import {TestCaseBaseClassForDataClumps} from "../../../TestCaseBaseClassForDataClumps";

const FileA = new MyFile('ArgoUML/src/org/argouml/taskmgmt/ProgressMonitor', `
// $Id: ProgressListener.java 11208 2006-09-18 22:34:49Z tfmorris $
// Copyright (c) 2006-2007 The Regents of the University of California. All
// Rights Reserved. Permission to use, copy, modify, and distribute this
// software and its documentation without fee, and without a written
// agreement is hereby granted, provided that the above copyright notice
// and this paragraph appear in all copies.  This software program and
// documentation are copyrighted by The Regents of the University of
// California. The software program and documentation are supplied "AS
// IS", without any accompanying services from The Regents. The Regents
// does not warrant that the operation of the program will be
// uninterrupted or error-free. The end-user understands that the program
// was developed for research purposes and is advised not to rely
// exclusively on the program for any reason.  IN NO EVENT SHALL THE
// UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT,
// SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS,
// ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
// THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF
// SUCH DAMAGE. THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE
// PROVIDED HEREUNDER IS ON AN "AS IS" BASIS, AND THE UNIVERSITY OF
// CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE MAINTENANCE, SUPPORT,
// UPDATES, ENHANCEMENTS, OR MODIFICATIONS.

package org.argouml.taskmgmt;


/**
 * This is a generic progress notifier. Can be used with any GUI progress bar
 * or any other progress GUI. It's this way to be independent of the GUI
 * implementation.
 * @author Bogdan Pistol
 */
public interface ProgressMonitor extends ProgressListener {
    
    /**
     * Informs the progress tool that the total progress was updated.
     * 
     * @param progress the amount of progress done so far, this is the whole
     * progress until now, not just the subtask's progress or the
     * main task's progress
     */
    void updateProgress(int progress);
    
    /**
     * Updates the subtask that is in progress.
     * @param name the name of the subtask
     */
    void updateSubTask(String name);
    
    /**
     * Updates the major task that is going on.
     * @param name the new task
     */
    void updateMainTask(String name);
    
    /**
     * Determines if the user wants to cancel the current action.
     * If this happens the current action should be stopped.
     * <p>
     * So in a long running action, you should query this periodicaly to see
     * if the user still wants to continue or he canceled the action.
     * <p>
     * NOTE: It appears to be some kind of Java tradition to misspell
     * the name of this method, so we follow the Swing and Eclipse tradition
     * of spelling it with a single "L".
     * @return true if the user cancelled the action and false otherwise
     */
    boolean isCanceled();
    
    /**
     * Determines the maximum amount of progress that can be reached.
     * This should be set before the progress is updated.
     * @param max the maximum progress value or -1 if the value is unknown
     */
    void setMaximumProgress(int max);
    
    /**
     * This method notifies the GUI that the working thread determines that
     * there are no actions that could be done for various reasons.
     * The GUI should notify the user too.
     */
    void notifyNullAction();
    
    /**
     * If something happens the user should be notified.
     * @param title a title for the error/information/etc
     * @param introduction a short message that will continue with the message
     * @param message the actual message with all the details
     */
    void notifyMessage(String title, String introduction, String message);

     /** 
     * Indicate that the operation is complete.  This happens automatically
     * when the value set by setProgress is >= max, but it may be called
     * earlier if the operation ends early.
     */
    public void close();

}
`);


const FileC = new MyFile('ArgoUML/src/org/argouml/reveng/ui/ImportStatusScreen.java',`
// $Id: ImportStatusScreen.java 14562 2008-05-01 18:05:26Z thn $
// Copyright (c) 2008 The Regents of the University of California. All
// Rights Reserved. Permission to use, copy, modify, and distribute this
// software and its documentation without fee, and without a written
// agreement is hereby granted, provided that the above copyright notice
// and this paragraph appear in all copies. This software program and
// documentation are copyrighted by The Regents of the University of
// California. The software program and documentation are supplied "AS
// IS", without any accompanying services from The Regents. The Regents
// does not warrant that the operation of the program will be
// uninterrupted or error-free. The end-user understands that the program
// was developed for research purposes and is advised not to rely
// exclusively on the program for any reason. IN NO EVENT SHALL THE
// UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT,
// SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS,
// ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
// THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF
// SUCH DAMAGE. THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE
// PROVIDED HEREUNDER IS ON AN "AS IS" BASIS, AND THE UNIVERSITY OF
// CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE MAINTENANCE, SUPPORT,
// UPDATES, ENHANCEMENTS, OR MODIFICATIONS.

package org.argouml.uml.reveng.ui;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Frame;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JProgressBar;
import javax.swing.SwingConstants;
import javax.swing.SwingUtilities;

import org.argouml.i18n.Translator;
import org.argouml.taskmgmt.ProgressEvent;
import org.argouml.taskmgmt.ProgressMonitor;

/**
 * A window that shows the progress bar and a cancel button.
 * As a convenience to callers which may be executing on a thread other
 * than the Swing event thread, all methods use SwingUtilities.invokeLater()
 * to make sure that Swing calls happen on the appropriate thread.
 *
 * TODO: React on the close button as if the Cancel button was pressed.
 */
public class ImportStatusScreen extends JDialog implements ProgressMonitor {
    
    private Frame parentFrame;
    private JButton cancelButton;
    private JLabel progressLabel;
    private JProgressBar progress;
    private boolean cancelled = false;

    /**
     * The constructor.
     *
     * @param title
     * @param iconName
     */
    public ImportStatusScreen(Frame frame, String title, String iconName) {
        super(frame, true);
        if (title != null) {
            setTitle(title);
        }
        Dimension scrSize = Toolkit.getDefaultToolkit().getScreenSize();
        getContentPane().setLayout(new BorderLayout(4, 4));
        parentFrame = frame;

        // Parsing file x of z.
        JPanel topPanel = new JPanel();
        progressLabel = new JLabel();
        progressLabel.setPreferredSize(new Dimension(400, 20));
        progressLabel.setHorizontalAlignment(SwingConstants.RIGHT);
        topPanel.add(progressLabel);
        getContentPane().add(topPanel, BorderLayout.NORTH);

        // progress bar
        progress = new JProgressBar();
        progress.setPreferredSize(new Dimension(350, 20));
        getContentPane().add(progress, BorderLayout.CENTER);

        // stop button
        cancelButton = new JButton(Translator.localize("button.cancel"));
        JPanel bottomPanel = new JPanel();
        bottomPanel.add(cancelButton);
        getContentPane().add(bottomPanel, BorderLayout.SOUTH);
        cancelButton.addActionListener(new ActionListener() {

            public void actionPerformed(ActionEvent e) {
                cancelled = true;

            }

        });

        pack();
        Dimension contentPaneSize = getContentPane().getPreferredSize();
        setLocation(scrSize.width / 2 - contentPaneSize.width / 2,
                scrSize.height / 2 - contentPaneSize.height / 2);
        setResizable(false);
    }

    public void setMaximumProgress(final int i) {
        SwingUtilities.invokeLater(new Runnable () {
            public void run() {
                progress.setMaximum(i);
                setVisible(true);
            }
        });
    }

    public void updateProgress(final int i) {
        SwingUtilities.invokeLater(new Runnable () {
            public void run() {
                progress.setValue(i);
            }
        });
    }

    /**
     * The UID.
     */
    private static final long serialVersionUID = -1336242911879462274L;

    /*
     * @see org.argouml.application.api.ProgressMonitor#close()
     */
    public void close() {
        SwingUtilities.invokeLater(new Runnable () {
            public void run() {
                setVisible(false);
                dispose();
            }
        });
    }

    /*
     * @see org.argouml.application.api.ProgressMonitor#isCanceled()
     */
    public boolean isCanceled() {
        return cancelled;
    }

    /*
     * @see org.argouml.application.api.ProgressMonitor#notifyMessage(java.lang.String, java.lang.String, java.lang.String)
     */
    public void notifyMessage(String title, String introduction,
            String message) {
        // TODO: Create an error dialog or panel in our progress dialog
        // for now we just use our old style separate error dialog
        ProblemsDialog problemsDialog = new ProblemsDialog(parentFrame, message);
        problemsDialog.setTitle(title);
        problemsDialog.setVisible(true);
        cancelled = problemsDialog.isAborted();
        // TODO: Only needed while we have a separate problem dialog
        // (see above)
        if (cancelled) {
            setVisible(false);
            dispose();
        }
    }

    /*
     * @see org.argouml.application.api.ProgressMonitor#notifyNullAction()
     */
    public void notifyNullAction() {
        String msg = Translator.localize("label.import.empty");
        notifyMessage(msg, msg, msg);
    }

    /*
     * @see org.argouml.application.api.ProgressMonitor#updateMainTask(java.lang.String)
     */
    public void updateMainTask(final String name) {
        SwingUtilities.invokeLater(new Runnable () {
            public void run() {
                setTitle(name);
            }
        });
    }

    /*
     * @see org.argouml.application.api.ProgressMonitor#updateSubTask(java.lang.String)
     */
    public void updateSubTask(final String action) {
        SwingUtilities.invokeLater(new Runnable () {
            public void run() {
                progressLabel.setText(action);
            }
        });
    }

    /*
     * @see org.argouml.persistence.ProgressListener#progress(org.argouml.persistence.ProgressEvent)
     */
    public void progress(ProgressEvent event) throws InterruptedException {
        // ignored
    }

}

`);

export const ArgoUMLExample = new TestCaseBaseClassForDataClumps(
    'ArgoUMLExample',
    [FileA, FileC],
    [FileA.getFileExtension()],
    []
);
