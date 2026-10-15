import React from "react"

export const JobCard = React.memo(({ job, handleApply, applied, loadingApply }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">

            <div className="space-y-3 border-b border-slate-200 pb-4 sm:pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    {job.jobTitle}
                </h1>

                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="bg-slate-100 px-3 py-1 rounded-full">
                        📍 {job.jobLoc}
                    </span>
                    <span className="bg-slate-100 px-3 py-1 rounded-full">
                        💼 {job.jobType}
                    </span>
                    <span className="bg-slate-100 px-3 py-1 rounded-full">
                        💰 {job.minSalary === 0 && job.maxSalary === 0 ? `Not Specified` : `₹${job.minSalary} – ₹${job.maxSalary}`}
                    </span>
                </div>
            </div>

            <div className="space-y-8 mt-8">

                <section>
                    <h2 className="text-lg font-semibold text-slate-800 mb-2">
                        Job Description
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                        {job.jobDesc}
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-800 mb-2">
                        Responsibilities
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                        {job.jobRes}
                    </p>
                </section>

                <section className="space-y-2">

                    <h2 className="text-lg font-semibold text-slate-800 mb-2">Requirements</h2>
                    <div>
                        <h3 className="text-md font-semibold text-slate-800 mb-2">
                            1. Minimum Requirements
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            {job.minJobQual}
                        </p>
                    </div>

                    {job.preferredJobQual && (
                        <div>
                            <h3 className="text-md font-semibold text-slate-800 mb-2">
                                2. Preferred Requirements
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {job.preferredJobQual}
                            </p>
                        </div>
                    )
                    }
                </section>

            </div>
            <button
                onClick={handleApply}
                disabled={applied || loadingApply}
                className={`mt-6 w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition ${applied
                    ? "bg-green-100 text-green-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                    }`}
            >
                {applied ? "Applied ✔" : loadingApply ? "Applying..." : "Apply Now"}
            </button>

        </div>
    )
}
)

// React.memo: compare old props with new props and in this comparison if props are primitive value which means 1 === 1 then it will be true and react.memo says props are same do not re-render child component but when props are functions or objects then they are compared by reference which means old reference vs new reference and whenever parent component re-renders functions and objects inside that are created again and because of that in props old reference vs new reference are different and because of that react.memo says re-render child component because props are changed and this problem will be solved by useCallback because useCallback memoize the function reference which means it tells react that re-create this function on every-render only if dependencies are changed which means if dependencies not changed then do not re-create this function and pass the function to the props where old reference === new reference and child avoids re-render