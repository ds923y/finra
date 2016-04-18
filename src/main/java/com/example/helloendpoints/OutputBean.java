package com.example.helloendpoints;

import java.util.ArrayList;

public class OutputBean {

  public ArrayList<String> output;
  public int combinations;
  public int page;
  public String phoneNumber;

  public OutputBean() {};

  public OutputBean(ArrayList<String> output, int combinations, int page, String phoneNumber) {
    this.output = output;
    this.combinations = combinations;
    this.page = page;
    this.phoneNumber = phoneNumber;
  }

  public int getCombinations() {
    return combinations;
  }

  public void setCombinations(int combinations) {
    this.combinations = combinations;
  }

  public ArrayList<String> getOutput(){
    return output;
  }

  public void setOutput(ArrayList<String> output){
    this.output = output;
  }

  public int getPage() {
    return page;
  }

  public void setPage(int page) {
    this.page = page;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

}
