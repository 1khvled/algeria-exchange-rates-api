from setuptools import setup, find_packages

setup(
    name="square-algerie",
    version="1.0.0",
    author="Square Live DZ",
    author_email="contact@squarealgerie.com",
    description="Python client for Algerian parallel currency rates (Square Port-Saïd), official bank rates, gold prices, and market spreads.",
    long_description=open("README.md", encoding="utf-8").read(),
    long_description_content_type="text/markdown",
    url="https://squarealgerie.com",
    project_urls={
        "Source": "https://github.com/1khvled/square-dz",
        "Tracker": "https://squarealgerie.com",
    },
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Topic :: Office/Business :: Financial :: Investment",
    ],
    python_requires=">=3.8",
    install_requires=[
        "urllib3>=1.26.0",
    ],
)
