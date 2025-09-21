interface LoadingSpinnerProps {
  show?: boolean;
}

export function LoadingSpinner({ show = true }: LoadingSpinnerProps) {
  if (!show) return null;
  return (
    <div className='flex justify-center items-center'>
      <div className='animate-spin rounded-full border-8 border-t-8 border-gray-200 border-t-gray-800 h-12 w-12'></div>
    </div>
  );
}
