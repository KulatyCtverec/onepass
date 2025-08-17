export default function Footer() {
  return (
    <footer className="w-full glass-effect border-t border-border/20 py-8 mt-16">
      <div className="container mx-auto px-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-foreground-muted">OnePass</span>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          </div>
          <p className="text-foreground-muted">
            &copy; 2024 OnePass. Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  );
}
