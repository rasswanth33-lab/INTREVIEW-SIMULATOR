export default function QuestionCard({ question, currentIdx, total, answerText, onAnswerChange }) {
    return (
        <div className="flex-1 flex flex-col mb-8 relative">
            <textarea
                className="flex-1 w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none min-h-[300px] font-sans"
                placeholder="Type your answer here..."
                value={answerText}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                spellCheck={false}
            />
        </div>
    );
}
