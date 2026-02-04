import React from 'react';

export function Container({ 
	children, 
	className = "", 
	maxWidth = "max-w-[500px]",
	showBorder = true,
	selectNone = true,
	text = "Default Text",
	showResetButton = false,
	onReset,
	contentDark = false,
	...props 
}) {
	const baseClasses = [
		"w-full",
		"min-w-[300px]",
		"min-h-[500px]",
		"h-[500px]",
		maxWidth,
		"mx-auto",
		"px-2",
		"bg-white",
		"rounded-lg",
		"flex",
		"flex-col",
	];

	if (showBorder) {
		baseClasses.push("border border-gray-200");
	}

	if (selectNone) {
		baseClasses.push("select-none");
	}

	const containerClasses = `${baseClasses.join(" ")} ${className}`.trim();

	return (
		<div className={containerClasses} {...props}>
			<div className="p-4 w-full flex flex-col flex-1 min-h-0">
				<div className="flex justify-between items-center mb-4 flex-shrink-0">
					<h2 className="text-[#5750E3] text-sm font-medium select-none">{text}</h2>
					{showResetButton && (
						<button 
							className="text-sm px-3 py-1 rounded border transition-colors text-gray-500 hover:text-gray-700 border-gray-300 hover:border-gray-400"
							onClick={onReset}
							title="Reset interactive"
						>
							Reset
						</button>
					)}
				</div>
				<div className="flex flex-col flex-1 min-h-0">
					<div className={`w-full flex-1 flex flex-col items-center justify-center min-h-0 border border-[#5750E3]/30 rounded-md relative overflow-hidden ${contentDark ? 'transition-colors duration-[1500ms] bg-black' : 'bg-white'}`} style={{ minHeight: '420px' }}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
