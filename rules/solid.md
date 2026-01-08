# SOLID Principles

Follow the **SOLID** principles for writing clean, maintainable, and scalable code:

## The 5 Principles

1. **S - Single Responsibility Principle (SRP)**: A class or module should have one reason to change
2. **O - Open/Closed Principle (OCP)**: Software entities should be open for extension, closed for modification
3. **L - Liskov Substitution Principle (LSP)**: Derived classes must be substitutable for their base classes
4. **I - Interface Segregation Principle (ISP)**: Clients shouldn't depend on interfaces they don't use
5. **D - Dependency Inversion Principle (DIP)**: Depend on abstractions, not concretions

## Decision Making

When designing code:
- Ensure each function/class has a single, well-defined purpose
- Use composition and interfaces to extend behavior without modifying existing code
- Design inheritance hierarchies that maintain substitutability
- Break large interfaces into smaller, focused ones
- Inject dependencies rather than creating them internally
