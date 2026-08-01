import os
import re

FRONTEND_DIR = r"d:\skincare2\frontend\app"
COMPONENTS_DIR = r"d:\skincare2\frontend\components"

replacements = {
    r'\bbg-slate-900\b': 'bg-white',
    r'\bbg-slate-950\b': 'bg-[#F8F9FA]',
    r'\bbg-slate-800\b': 'bg-white',
    r'\bbg-slate-800/50\b': 'bg-white shadow-sm',
    r'\bbg-slate-800/30\b': 'bg-gray-50',
    r'\bborder-slate-700\b': 'border-gray-200',
    r'\bborder-slate-700/50\b': 'border-gray-100',
    r'\bborder-slate-600\b': 'border-gray-200',
    r'\btext-white\b': 'text-gray-900',
    r'\btext-slate-50\b': 'text-gray-900',
    r'\btext-slate-300\b': 'text-gray-600',
    r'\btext-slate-400\b': 'text-gray-500',
    r'\btext-slate-500\b': 'text-gray-400',
    r'\bbg-sky-500\b': 'bg-[#306CE9]',
    r'\bbg-sky-500/10\b': 'bg-blue-50',
    r'\bbg-sky-500/20\b': 'bg-blue-100',
    r'\bhover:bg-sky-400\b': 'hover:bg-blue-600',
    r'\bhover:bg-slate-800\b': 'hover:bg-gray-50',
    r'\bhover:bg-slate-600\b': 'hover:bg-gray-100',
    r'\btext-sky-400\b': 'text-[#306CE9]',
    r'\btext-sky-500\b': 'text-[#306CE9]',
    r'\btext-sky-300\b': 'text-blue-700',
    r'\bborder-sky-500\b': 'border-blue-500',
    r'\bborder-sky-500/30\b': 'border-blue-200',
    r'\bbg-emerald-500/20\b': 'bg-emerald-100',
    r'\bbg-emerald-900/20\b': 'bg-emerald-50',
    r'\btext-emerald-400\b': 'text-emerald-600',
    r'\bborder-emerald-500/30\b': 'border-emerald-200',
    r'\bbg-emerald-600\b': 'bg-emerald-500',
    r'\bbg-amber-500/20\b': 'bg-amber-100',
    r'\btext-amber-400\b': 'text-amber-600',
    r'\bbg-rose-500/20\b': 'bg-rose-100',
    r'\btext-rose-400\b': 'text-rose-600',
    r'\btext-indigo-400\b': 'text-indigo-600',
    r'\bbg-indigo-500/20\b': 'bg-indigo-100',
    r'\btext-indigo-300\b': 'text-indigo-600',
    r'\bborder-indigo-500/30\b': 'border-indigo-200',
    r'\bg-slate-900/50\b': 'bg-gray-50',
}

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx'):
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for pattern, replacement in replacements.items():
                    # We need to escape slashes in patterns? No, re uses raw string usually.
                    # but wait, r'\bbg-slate-800/50\b' - the slash is fine in regex.
                    new_content = re.sub(pattern, replacement, new_content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {filepath}")

if __name__ == '__main__':
    process_directory(FRONTEND_DIR)
    process_directory(COMPONENTS_DIR)
    print("Theme refactoring complete.")
